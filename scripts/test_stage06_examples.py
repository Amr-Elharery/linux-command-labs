#!/usr/bin/env python3
"""Run Stage 05 system-information examples without brittle live-value checks."""
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
PAGES = sorted((ROOT / "content/stages/05-system-information").glob("*.md"))
PAGES += sorted((ROOT / "content/challenges").glob("disk-usage-detective.md"))
FENCE = re.compile(r"```bash\s*\n(.*?)\n```", re.DOTALL)
ENV = {**os.environ, "TERM": "dumb", "LC_ALL": "C"}


def digest_tree(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


def make_sandbox() -> tempfile.TemporaryDirectory:
    temp = tempfile.TemporaryDirectory(prefix="linux-labs-stage06-")
    base = Path(temp.name)
    shutil.copytree(ROOT / "playground", base / "playground")
    shutil.copytree(ROOT / "setup", base / "setup")
    result = subprocess.run(
        ["bash", "setup/setup.sh"], cwd=base, env=ENV, text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=5, check=False,
    )
    if result.returncode:
        temp.cleanup()
        raise RuntimeError(f"fixture setup failed: {result.stderr}")
    return temp


def run_shell(cwd: Path, command: str) -> subprocess.CompletedProcess[str]:
    process = subprocess.Popen(
        ["bash", "-e", "-u", "-o", "pipefail", "-c", command],
        cwd=cwd, env=ENV, text=True, stdin=subprocess.PIPE,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True,
    )
    try:
        out, err = process.communicate(input="", timeout=5)
    except subprocess.TimeoutExpired as exc:
        os.killpg(process.pid, signal.SIGKILL)
        process.communicate()
        raise RuntimeError("example exceeded its five-second timeout") from exc
    return subprocess.CompletedProcess(process.args, process.returncode, out, err)


def main() -> int:
    source_digest = digest_tree(ROOT / "playground")
    tested = 0
    for page in PAGES:
        for index, match in enumerate(FENCE.finditer(page.read_text(encoding="utf-8-sig")), start=1):
            temp = make_sandbox()
            try:
                result = run_shell(Path(temp.name), match.group(1))
                if result.returncode:
                    raise RuntimeError(
                        f"{page.relative_to(ROOT)} Bash block {index} failed "
                        f"({result.returncode}):\n{result.stdout}{result.stderr}"
                    )
            finally:
                temp.cleanup()
            tested += 1
            print(f"[PASS] {page.relative_to(ROOT)} Bash block {index}")

    temp = make_sandbox()
    try:
        root = Path(temp.name)
        top = run_shell(root, "top -b -n 1 | sed -n '1,8p'")
        if top.returncode or not re.search(r"(?m)^top\s+-", top.stdout):
            raise RuntimeError(f"batch top output structure check failed: {top.stdout!r} {top.stderr!r}")

        free = run_shell(root, "free -h")
        if free.returncode or "Mem:" not in free.stdout or "Swap:" not in free.stdout:
            raise RuntimeError(f"free output structure check failed: {free.stdout!r}")

        df = run_shell(root, "df -hT playground")
        if df.returncode or not all(label in df.stdout for label in ("Filesystem", "Type", "Size", "Avail")):
            raise RuntimeError(f"df output structure check failed: {df.stdout!r}")

        fixture = root / "playground/data/employees.csv"
        du_file = run_shell(root, "du -b -- playground/data/employees.csv")
        actual_size = int(du_file.stdout.split()[0]) if du_file.stdout.split() else -1
        if du_file.returncode or actual_size != fixture.stat().st_size:
            raise RuntimeError(
                f"du apparent byte count mismatch: {actual_size} != {fixture.stat().st_size}"
            )

        sorted_usage = run_shell(root, "du -b --max-depth=1 playground | sort -n")
        rows = [line.split(maxsplit=1) for line in sorted_usage.stdout.splitlines()]
        try:
            byte_totals = [int(row[0]) for row in rows]
        except (IndexError, ValueError) as exc:
            raise RuntimeError(f"could not parse sorted du byte summaries: {sorted_usage.stdout!r}") from exc
        if sorted_usage.returncode or not rows or byte_totals != sorted(byte_totals):
            raise RuntimeError(f"du/sort numeric order check failed: {sorted_usage.stdout!r}")

        timed = run_shell(
            root,
            "TIMEFORMAT='real=%R user=%U sys=%S'; time wc -l playground/data/transactions.csv",
        )
        if timed.returncode or not re.search(r"real=[0-9.]+ user=[0-9.]+ sys=[0-9.]+", timed.stderr):
            raise RuntimeError(f"Bash time format check failed: {timed.stdout!r} {timed.stderr!r}")
        if timed.stdout.strip() != "6 playground/data/transactions.csv":
            raise RuntimeError(f"timed deterministic wc output changed: {timed.stdout!r}")
    finally:
        temp.cleanup()

    if digest_tree(ROOT / "playground") != source_digest:
        raise RuntimeError("Stage 05 tests modified the source playground")
    print("[PASS] dynamic top/free/df structure checks; no metric values were fixed")
    print("[PASS] du byte count/sort and time-format checks")
    print(f"[PASS] source playground unchanged; executed {tested} Bash blocks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
