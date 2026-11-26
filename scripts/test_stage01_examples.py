#!/usr/bin/env python3
"""Execute every bash-fenced Stage 01 example in an isolated fixture copy."""
from __future__ import annotations

import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted((ROOT / "content/stages/01-file-system").glob("*.md"))
PAGES.append(ROOT / "content/challenges/directory-organization.md")
FENCE = re.compile(r"```bash\s*\n(.*?)\n```", re.DOTALL)


def run_block(page: Path, index: int, source: str) -> None:
    with tempfile.TemporaryDirectory(prefix="linux-labs-stage01-") as name:
        sandbox = Path(name)
        shutil.copytree(ROOT / "playground", sandbox / "playground")
        shutil.copytree(ROOT / "setup", sandbox / "setup")
        init = subprocess.run(
            ["bash", "setup/setup.sh"], cwd=sandbox, text=True,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
        )
        if init.returncode:
            raise RuntimeError(f"could not initialize test fixtures: {init.stderr}")
        answer = "y\n" if "cp -i " in source or "rm -i " in source else ""
        result = subprocess.run(
            ["bash", "-e", "-u", "-o", "pipefail", "-c", source],
            cwd=sandbox, text=True, input=answer,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
        )
        if result.returncode:
            excerpt = (result.stdout + result.stderr).strip()
            raise RuntimeError(f"{page.relative_to(ROOT)} bash block {index} failed ({result.returncode}):\n{excerpt}")
        if page.name == "directory-organization.md" and index == 1:
            workspace = sandbox / "playground/projects/organization-lab"
            expected = (
                "inbox/quarterly report.txt",
                "inbox/launch-checklist.txt",
                "work/drafts",
                "work/approved/quarterly-report-approved.txt",
                "work/approved/launch-checklist.txt",
                "work/archive",
                "work/archive/README.txt",
                "reference/README.txt",
                "inbox/.draft-note",
            )
            for relative in expected:
                if not (workspace / relative).exists():
                    raise RuntimeError(f"{page.relative_to(ROOT)} solution did not create/preserve {relative}")
            if (workspace / "work/drafts/checklist.tmp").exists():
                raise RuntimeError(f"{page.relative_to(ROOT)} solution left its temporary file behind")


def main() -> int:
    tested = 0
    for page in PAGES:
        body = page.read_text(encoding="utf-8-sig")
        for index, match in enumerate(FENCE.finditer(body), start=1):
            run_block(page, index, match.group(1))
            tested += 1
            print(f"[PASS] {page.relative_to(ROOT)} bash block {index}")
    print(f"Executed {tested} Bash example block(s) in isolated playground copies.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
