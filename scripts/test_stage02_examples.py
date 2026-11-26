#!/usr/bin/env python3
"""Execute Stage 02 Bash examples without hanging on pagers/follow mode."""
from __future__ import annotations

import re
import os
import signal
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted(path for path in (ROOT / "content/stages/02-file-content").glob("*.md") if path.name != "README.md")
PAGES.append(ROOT / "content/challenges/log-inspection.md")
FENCE = re.compile(r"```bash\s*\n(.*?)\n```", re.DOTALL)
LOGS = Path("playground/logs")
ENV = {**os.environ, "TERM": "dumb", "LESS": "FRX", "MORE": "-f"}


def make_sandbox() -> tempfile.TemporaryDirectory:
    tmp = tempfile.TemporaryDirectory(prefix="linux-labs-stage02-")
    sandbox = Path(tmp.name)
    shutil.copytree(ROOT / "playground", sandbox / "playground")
    shutil.copytree(ROOT / "setup", sandbox / "setup")
    init = subprocess.run(
        ["bash", "setup/setup.sh"], cwd=sandbox, env=ENV, text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=5, check=False,
    )
    if init.returncode:
        tmp.cleanup()
        raise RuntimeError(f"could not initialize isolated fixtures: {init.stderr}")
    return tmp


def run_shell(sandbox: Path, source: str, *, timeout: float = 5.0) -> subprocess.CompletedProcess[str]:
    process = subprocess.Popen(
        ["bash", "-e", "-u", "-o", "pipefail", "-c", source],
        cwd=sandbox, env=ENV, text=True, stdin=subprocess.PIPE,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True,
    )
    try:
        stdout, stderr = process.communicate(input="", timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGKILL)
        stdout, stderr = process.communicate()
        raise
    return subprocess.CompletedProcess(process.args, process.returncode, stdout, stderr)


def run_block(page: Path, index: int, source: str) -> None:
    tmp = make_sandbox()
    try:
        sandbox = Path(tmp.name)
        try:
            result = run_shell(sandbox, source, timeout=5)
        except subprocess.TimeoutExpired as exc:
            raise RuntimeError(f"{page.relative_to(ROOT)} Bash block {index} hung (5 second limit)") from exc
        bounded_follow = "timeout " in source
        allowed = {0, 124} if bounded_follow else {0}
        if result.returncode not in allowed:
            excerpt = (result.stdout + result.stderr).strip()
            raise RuntimeError(
                f"{page.relative_to(ROOT)} Bash block {index} failed ({result.returncode}):\n{excerpt}"
            )
        if bounded_follow and result.returncode != 124:
            raise RuntimeError(f"{page.relative_to(ROOT)} Bash block {index} did not reach its timeout boundary")
    finally:
        tmp.cleanup()


def verify_fixture_output() -> None:
    tmp = make_sandbox()
    try:
        sandbox = Path(tmp.name)
        app = (sandbox / LOGS / "app.log").read_text(encoding="utf-8").splitlines()
        auth = (sandbox / LOGS / "auth.log").read_text(encoding="utf-8").splitlines()
        checks = (
            ("cat playground/logs/app.log", app),
            ("head -n 2 playground/logs/app.log", app[:2]),
            ("tail -n 2 playground/logs/app.log", app[-2:]),
            ("cat playground/logs/auth.log | tail -n 2", auth[-2:]),
        )
        for command, expected in checks:
            result = run_shell(sandbox, command)
            if result.returncode or result.stdout.splitlines() != expected:
                raise RuntimeError(f"fixture output mismatch for {command!r}: {result.stdout!r}")
        for file_name, fixture in (("app.log", app), ("auth.log", auth)):
            result = run_shell(sandbox, f"nl -ba playground/logs/{file_name}")
            numbered = result.stdout.splitlines()
            if result.returncode or len(numbered) != len(fixture):
                raise RuntimeError(f"nl output count mismatch for {file_name}")
            for number, (line, record) in enumerate(zip(numbered, fixture), start=1):
                if not re.search(rf"^\s*{number}\s+{re.escape(record)}$", line):
                    raise RuntimeError(f"nl output mismatch for {file_name} line {number}: {line!r}")
        for command, fixture in (
            ("more -f playground/logs/auth.log", auth),
            ("less -F -X playground/logs/app.log", app),
        ):
            result = run_shell(sandbox, command)
            if result.returncode or any(record not in result.stdout for record in fixture):
                raise RuntimeError(f"pager output mismatch for {command!r}: {result.stdout!r}")
        for follow in ("-f", "-F"):
            command = f"timeout --signal=INT 0.2s tail -n 2 {follow} playground/logs/app.log"
            result = run_shell(sandbox, command)
            if result.returncode != 124 or result.stdout.splitlines() != app[-2:]:
                raise RuntimeError(f"bounded {follow} output mismatch: {result.stdout!r} ({result.returncode})")
    finally:
        tmp.cleanup()


def main() -> int:
    tested = 0
    for page in PAGES:
        body = page.read_text(encoding="utf-8-sig")
        for index, match in enumerate(FENCE.finditer(body), start=1):
            run_block(page, index, match.group(1))
            tested += 1
            print(f"[PASS] {page.relative_to(ROOT)} Bash block {index}")
    verify_fixture_output()
    print("[PASS] deterministic cat/head/tail/pager/nl output matches the synthetic fixtures")
    print(f"Executed {tested} Bash example block(s) in isolated playground copies; pager timeout limit was 5 seconds.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
