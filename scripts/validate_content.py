#!/usr/bin/env python3
"""Validate Linux Labs Markdown metadata and local content links (stdlib only)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
COMMANDS = {
    "ls", "pwd", "cd", "mkdir", "cp", "mv", "rm", "cat", "more", "less",
    "head", "tail", "nl", "which", "whereis", "find", "grep", "wc", "cut",
    "sort", "uniq", "tr", "diff", "join", "xargs", "awk", "top", "free",
    "df", "du", "time",
}
CATEGORIES = {
    1: "file-system", 2: "file-content", 3: "file-search",
    4: "text-processing", 5: "system-information",
}
ENUMS = {
    "type": {"command", "challenge"},
    "mode": {"detailed", "revision"},
    "difficulty": {"beginner", "intermediate", "advanced"},
}


def parse_frontmatter(path: Path) -> tuple[dict[str, object], str]:
    text = path.read_text(encoding="utf-8-sig")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValueError("missing opening YAML frontmatter delimiter")
    try:
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    except StopIteration as exc:
        raise ValueError("missing closing YAML frontmatter delimiter") from exc
    data: dict[str, object] = {}
    for line in lines[1:end]:
        match = re.fullmatch(r"([a-z_]+):\s*(.*?)\s*", line)
        if not match:
            raise ValueError(f"unsupported frontmatter line: {line!r}")
        key, value = match.groups()
        if key in data:
            raise ValueError(f"duplicate frontmatter key {key!r}")
        if value.startswith("[") and value.endswith("]"):
            inside = value[1:-1].strip()
            data[key] = [] if not inside else [item.strip().strip("\"'") for item in inside.split(",")]
        elif value.isdigit():
            data[key] = int(value)
        else:
            data[key] = value.strip("\"'")
    return data, "\n".join(lines[end + 1 :])


def main() -> int:
    errors: list[str] = []
    # README files describe folders rather than individual content records and
    # intentionally do not carry content frontmatter.
    pages = sorted(path for path in CONTENT.rglob("*.md") if path.name.lower() != "readme.md")
    by_command: dict[str, set[str]] = {}
    for path in pages:
        rel = path.relative_to(ROOT).as_posix()
        try:
            meta, body = parse_frontmatter(path)
        except (OSError, ValueError) as exc:
            errors.append(f"{rel}: {exc}")
            continue
        kind = meta.get("type")
        required = ({"id", "title", "type", "stage", "category", "mode", "difficulty", "summary", "tags", "related"}
                    if kind == "command" else
                    {"id", "title", "type", "stage", "difficulty", "summary", "objectives", "prerequisites", "starting_files"})
        for key in sorted(required - meta.keys()):
            errors.append(f"{rel}: missing required field {key}")
        if kind not in ENUMS["type"]:
            errors.append(f"{rel}: type must be command or challenge")
        if not isinstance(meta.get("stage"), int) or meta["stage"] not in range(1, 6):
            errors.append(f"{rel}: stage must be an integer from 1 to 5")
        for key, allowed in ENUMS.items():
            if key in meta and meta[key] not in allowed:
                errors.append(f"{rel}: invalid {key} value {meta[key]!r}")
        if kind == "command":
            command_id, mode, stage = meta.get("id"), meta.get("mode"), meta.get("stage")
            if command_id not in COMMANDS:
                errors.append(f"{rel}: command id is not in the supplied course inventory")
            else:
                by_command.setdefault(str(command_id), set()).add(str(mode))
                expected_category = CATEGORIES.get(stage) if isinstance(stage, int) else None
                if meta.get("category") != expected_category:
                    errors.append(f"{rel}: category does not match stage {stage}")
                if path.name != f"{command_id}.{mode}.md":
                    errors.append(f"{rel}: filename must be {command_id}.{mode}.md")
            for related in meta.get("related", []) if isinstance(meta.get("related"), list) else []:
                if related not in COMMANDS:
                    errors.append(f"{rel}: unknown related command id {related!r}")
        elif kind == "challenge":
            for field in ("objectives", "prerequisites", "starting_files"):
                if not isinstance(meta.get(field), list):
                    errors.append(f"{rel}: {field} must be a list")
            for prerequisite in meta.get("prerequisites", []) if isinstance(meta.get("prerequisites"), list) else []:
                if prerequisite not in COMMANDS:
                    errors.append(f"{rel}: unknown prerequisite command id {prerequisite!r}")
            for item in meta.get("starting_files", []) if isinstance(meta.get("starting_files"), list) else []:
                if not isinstance(item, str) or not item.startswith("playground/") or not (ROOT / item).is_file():
                    errors.append(f"{rel}: starting file must exist within playground/: {item!r}")
            if not re.search(r"<details>\s*<summary>Show solution</summary>[\s\S]*?</details>", body):
                errors.append(f"{rel}: solution must be in a Show solution details block")
        for target in re.findall(r"\[[^\]]*\]\(([^)#]+)(?:#[^)]*)?\)", body):
            if "://" not in target and not (path.parent / target).resolve().is_file():
                errors.append(f"{rel}: broken local link {target!r}")
    for command_id, modes in sorted(by_command.items()):
        if modes != {"detailed", "revision"}:
            errors.append(f"command {command_id}: expected detailed and revision files; found {sorted(modes)}")
    if errors:
        print("Content validation failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print(f"Content validation passed: {len(pages)} Markdown page(s), {len(by_command)} complete command pair(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
