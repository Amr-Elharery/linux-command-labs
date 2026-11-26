#!/usr/bin/env python3
"""Execute Stage 04 Bash examples against disposable synthetic playground copies."""
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
PAGES = sorted((ROOT / "content/stages/04-text-processing").glob("*.md"))
PAGES += sorted((ROOT / "content/challenges").glob("needle-in-the-haystack.md"))
PAGES += sorted((ROOT / "content/challenges").glob("word-count-and-sorting.md"))
PAGES += sorted((ROOT / "content/challenges").glob("processing-employees-data.md"))
PAGES += sorted((ROOT / "content/challenges").glob("integrated-text-pipeline.md"))
FENCE = re.compile(r"```bash\s*\n(.*?)\n```", re.DOTALL)
ENV = {**os.environ, "TERM": "dumb", "LC_ALL": "C"}


def digest_tree(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


def make_sandbox() -> tempfile.TemporaryDirectory:
    temp = tempfile.TemporaryDirectory(prefix="linux-labs-stage05-")
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


def check(cwd: Path, command: str, expected: str, *, contains: bool = False) -> None:
    result = run_shell(cwd, command)
    actual = result.stdout.strip()
    ok = expected in actual if contains else actual == expected
    if result.returncode or not ok:
        raise RuntimeError(
            f"assertion failed for {command!r} (status {result.returncode})\n"
            f"expected {expected!r}; got {actual!r}\n{result.stderr}"
        )


def verify_deterministic_fixtures() -> None:
    temp = make_sandbox()
    try:
        root = Path(temp.name)
        check(root, "grep -c 'WARN' playground/logs/app.log", "2")
        check(root, "grep -ic 'failed' playground/logs/auth.log", "2")
        check(root, "wc -l < playground/logs/app.log", "5")
        check(root, "tail -n +2 playground/data/employees.csv | wc -l", "5")
        check(root, "tail -n +2 playground/data/employees.csv | cut -d, -f3 | sort | uniq -c",
              "2 Engineering\n      1 Finance\n      2 Support")
        check(root, "printf '%s\\n' 100 20 3 | sort -n", "3\n20\n100")
        check(root, "printf '%s\\n' error warning error | uniq -c",
              "1 error\n      1 warning\n      1 error")
        check(root, "awk -F, 'NR > 1 && $6 == \"complete\" { total += $5; n++ } END { printf \"%.2f %d\\n\", total, n }' playground/data/transactions.csv",
              "68.25 3")
        check(root, "awk -F, 'NR > 1 && $5 == \"active\" { n++ } END { print n }' playground/data/employees.csv", "4")
        join = run_shell(root, "join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)")
        if join.returncode or len(join.stdout.splitlines()) != 5 or "Engineering" not in join.stdout:
            raise RuntimeError(f"sorted join assertion failed: {join.stdout!r} {join.stderr!r}")
        unsorted = run_shell(root, "join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv) <(tail -n +2 playground/data/departments.csv)")
        if len(unsorted.stdout.splitlines()) >= 5:
            raise RuntimeError("unsorted join assumption check did not expose missing matches")
        # Demonstrate xargs -0 safely with spaces, shell punctuation, and a
        # command-substitution-looking filename, all created inside the sandbox.
        inbox = root / "playground/projects/organization-lab/inbox"
        (inbox / "name with spaces.txt").write_text("one\n", encoding="utf-8")
        (inbox / "literal;$(touch PWNED).txt").write_text("two\n", encoding="utf-8")
        nul = run_shell(
            root,
            "find playground/projects/organization-lab/inbox -type f -name '*.txt' -print0 | xargs -0 -r wc -l --",
        )
        if nul.returncode or "name with spaces.txt" not in nul.stdout or "literal;$(touch PWNED).txt" not in nul.stdout:
            raise RuntimeError(f"NUL-safe filename handling failed: {nul.stdout!r} {nul.stderr!r}")
        if (root / "PWNED").exists():
            raise RuntimeError("special filename was evaluated as shell syntax")
        print("[PASS] deterministic grep/wc/cut/sort/uniq/awk/join checks")
        print("[PASS] sorted join prerequisite and whitespace/special-character xargs checks")
    finally:
        temp.cleanup()


def main() -> int:
    before = digest_tree(ROOT / "playground")
    tested = 0
    for page in PAGES:
        if not page.exists():
            continue
        text = page.read_text(encoding="utf-8-sig")
        blocks = list(FENCE.finditer(text))
        for index, match in enumerate(blocks, start=1):
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
    verify_deterministic_fixtures()
    if digest_tree(ROOT / "playground") != before:
        raise RuntimeError("Stage 04 runner modified the source playground")
    print(f"[PASS] source playground unchanged; executed {tested} Bash blocks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
