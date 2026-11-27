#!/usr/bin/env python3
"""Run Stage 03 search examples in disposable playground copies."""
from __future__ import annotations

import hashlib
import os
import re
import shutil
import signal
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted(path for path in (ROOT / "content/stages/03-file-search").glob("*.md") if path.name != "README.md")
PAGES.append(ROOT / "content/challenges/critical-resource-discovery.md")
FENCE = re.compile(r"```bash\s*\n(.*?)\n```", re.DOTALL)
ENV = {**os.environ, "TERM": "dumb"}


def tree_digest(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(item for item in root.rglob("*") if item.is_file()):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


def make_sandbox() -> tempfile.TemporaryDirectory:
    tmp = tempfile.TemporaryDirectory(prefix="linux-labs-stage03-")
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


def run_shell(sandbox: Path, source: str, timeout: float = 5.0) -> subprocess.CompletedProcess[str]:
    process = subprocess.Popen(
        ["bash", "-e", "-u", "-o", "pipefail", "-c", source],
        cwd=sandbox, env=ENV, text=True, stdin=subprocess.PIPE,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True,
    )
    try:
        stdout, stderr = process.communicate(input="", timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGKILL)
        process.communicate()
        raise
    return subprocess.CompletedProcess(process.args, process.returncode, stdout, stderr)


def run_block(page: Path, index: int, source: str) -> None:
    tmp = make_sandbox()
    try:
        try:
            result = run_shell(Path(tmp.name), source)
        except subprocess.TimeoutExpired as exc:
            raise RuntimeError(f"{page.relative_to(ROOT)} Bash block {index} hung (5 second limit)") from exc
        if result.returncode:
            excerpt = (result.stdout + result.stderr).strip()
            raise RuntimeError(
                f"{page.relative_to(ROOT)} Bash block {index} failed ({result.returncode}):\n{excerpt}"
            )
    finally:
        tmp.cleanup()


def verify_search_results() -> None:
    tmp = make_sandbox()
    try:
        sandbox = Path(tmp.name)
        files = {p.relative_to(sandbox).as_posix(): p.stat().st_size
                 for p in (sandbox / "playground").rglob("*") if p.is_file()}
        checks = (
            ("find playground -type f -name 'app.log' -print", {"playground/logs/app.log"}),
            ("find playground/projects/atlas -maxdepth 1 -type d -print",
             {"playground/projects/atlas", "playground/projects/atlas/src", "playground/projects/atlas/config"}),
            ("find playground/data -type f -iname '*.CSV' -print",
             {path for path in files if path.startswith("playground/data/") and path.lower().endswith(".csv")}),
            ("find playground -type f -size +200c -print",
             {path for path, size in files.items() if size > 200}),
            ("find playground -maxdepth 2 -type f -print",
             {path for path in files if len(Path(path).parts) <= 3}),
            ("find playground -type f \\( -iname '*.log' -o -iname '*.conf' \\) -print",
             {path for path in files if path.lower().endswith((".log", ".conf"))}),
            ("find playground/projects/organization-lab/inbox -type f -name 'quarterly report.txt' -print",
             {"playground/projects/organization-lab/inbox/quarterly report.txt"}),
        )
        for command, expected in checks:
            result = run_shell(sandbox, command)
            actual = set(result.stdout.splitlines())
            if result.returncode or actual != expected:
                raise RuntimeError(f"find fixture result mismatch for {command!r}: {actual!r} != {expected!r}")

        time_root = "playground/projects/organization-lab/work/time-lab"
        created = run_shell(
            sandbox,
            f"mkdir -p {time_root} && touch {time_root}/fresh.txt && touch -d '2 days ago' {time_root}/older.txt",
        )
        if created.returncode:
            raise RuntimeError(f"could not create controlled mtime samples: {created.stderr}")
        recent = run_shell(sandbox, f"find {time_root} -type f -mmin -5 -print")
        older = run_shell(sandbox, f"find {time_root} -type f -mtime +1 -print")
        if recent.stdout.splitlines() != [f"{time_root}/fresh.txt"]:
            raise RuntimeError(f"-mmin did not select only the fresh sample: {recent.stdout!r}")
        if older.stdout.splitlines() != [f"{time_root}/older.txt"]:
            raise RuntimeError(f"-mtime did not select only the older sample: {older.stdout!r}")

        which = run_shell(sandbox, "which grep")
        shell_lookup = run_shell(sandbox, "command -v grep")
        if which.returncode or shell_lookup.returncode or which.stdout.strip() != shell_lookup.stdout.strip():
            raise RuntimeError("which and Bash PATH lookup did not resolve grep consistently")
        whereis = run_shell(sandbox, "whereis -b grep")
        if whereis.returncode or "grep:" not in whereis.stdout or "/" not in whereis.stdout:
            raise RuntimeError(f"whereis did not report a binary location: {whereis.stdout!r}")

        wc_result = run_shell(sandbox, "find playground/logs -type f -name '*.log' -exec wc -l -- {} +")
        if wc_result.returncode or "app.log" not in wc_result.stdout or "auth.log" not in wc_result.stdout:
            raise RuntimeError(f"read-only find -exec output mismatch: {wc_result.stdout!r}")
        nul_result = run_shell(
            sandbox,
            "find playground/projects/organization-lab/inbox -type f -print0 | xargs -0 -r ls -ld --",
        )
        if nul_result.returncode or "quarterly report.txt" not in nul_result.stdout:
            raise RuntimeError(f"NUL-delimited xargs failed to preserve a spaced path: {nul_result.stdout!r}")
    finally:
        tmp.cleanup()


def main() -> int:
    before = tree_digest(ROOT / "playground")
    tested = 0
    for page in PAGES:
        body = page.read_text(encoding="utf-8-sig")
        for index, match in enumerate(FENCE.finditer(body), start=1):
            run_block(page, index, match.group(1))
            tested += 1
            print(f"[PASS] {page.relative_to(ROOT)} Bash block {index}")
    verify_search_results()
    print("[PASS] deterministic name/type/size/time/PATH/whereis/NUL-path checks")
    if tree_digest(ROOT / "playground") != before:
        raise RuntimeError("Stage 03 tests modified the repository playground")
    print(f"[PASS] source playground remained unchanged; executed {tested} Bash block(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
