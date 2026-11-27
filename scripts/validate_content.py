#!/usr/bin/env python3
"""Validate Linux Labs Markdown metadata and local content links (stdlib only)."""
from __future__ import annotations

import re
import json
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
STAGE_SLUGS = {
    1: "01-file-system", 2: "02-file-content", 3: "03-file-search",
    4: "04-text-processing", 5: "05-system-information",
}
STAGE_COMMANDS = {
    1: {"ls", "pwd", "cd", "mkdir", "cp", "mv", "rm"},
    2: {"cat", "more", "less", "head", "tail", "nl"},
    3: {"which", "whereis", "find"},
    4: {"grep", "wc", "cut", "sort", "uniq", "tr", "diff", "join", "xargs", "awk"},
    5: {"top", "free", "df", "du", "time"},
}
COMMAND_STAGE = {command: stage for stage, commands in STAGE_COMMANDS.items() for command in commands}
CHEATSHEET_SECTIONS = {
    "Commands covered", "Purpose", "Essential syntax", "High-value options",
    "Short examples", "Useful combinations", "Common mistakes and safety", "Learn more",
}
CATEGORIES = {
    1: "file-system", 2: "file-content", 3: "file-search",
    4: "text-processing", 5: "system-information",
}
ASSESSMENT = CONTENT / "assessments" / "final-assessment.json"
ENUMS = {
    "type": {"command", "challenge", "cheatsheet"},
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


def validate_assessment(errors: list[str]) -> None:
    rel = ASSESSMENT.relative_to(ROOT).as_posix()
    try:
        data = json.loads(ASSESSMENT.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{rel}: cannot read valid JSON: {exc}")
        return
    if not isinstance(data, dict) or data.get("id") != "linux-labs-final-assessment":
        errors.append(f"{rel}: expected the final assessment object and stable id")
        return
    sections = data.get("sections")
    if not isinstance(sections, list) or len(sections) != 6:
        errors.append(f"{rel}: expected six assessment sections")
        return
    section_ids: set[str] = set()
    task_ids: set[str] = set()
    points = 0
    for section in sections:
        if not isinstance(section, dict):
            errors.append(f"{rel}: each section must be an object")
            continue
        section_id = section.get("id")
        if not isinstance(section_id, str) or not section_id or section_id in section_ids:
            errors.append(f"{rel}: section ids must be unique non-empty strings")
        else:
            section_ids.add(section_id)
        tasks = section.get("tasks")
        if not isinstance(tasks, list) or not tasks:
            errors.append(f"{rel}: every section must contain tasks")
            continue
        for task in tasks:
            if not isinstance(task, dict):
                errors.append(f"{rel}: each task must be an object")
                continue
            task_id = task.get("id")
            if not isinstance(task_id, str) or not task_id or task_id in task_ids:
                errors.append(f"{rel}: task ids must be unique non-empty strings")
            else:
                task_ids.add(task_id)
            task_points = task.get("points")
            if not isinstance(task_points, int) or isinstance(task_points, bool) or task_points <= 0:
                errors.append(f"{rel}: task {task_id!r} must have positive integer points")
            else:
                points += task_points
            if task.get("type") == "knowledge":
                if not isinstance(task.get("acceptedAnswers"), list) or not task["acceptedAnswers"]:
                    errors.append(f"{rel}: knowledge task {task_id!r} needs accepted answers")
            elif task.get("type") == "self_assessed":
                if not isinstance(task.get("rubric"), list) or not task["rubric"]:
                    errors.append(f"{rel}: self-assessed task {task_id!r} needs a rubric")
            else:
                errors.append(f"{rel}: task {task_id!r} has an unknown type")
            for key in ("prompt", "hint", "feedback", "solution"):
                if not isinstance(task.get(key), str) or not task[key].strip():
                    errors.append(f"{rel}: task {task_id!r} needs {key}")
    if points != 100:
        errors.append(f"{rel}: task points must total 100; found {points}")
    if data.get("passingScore") != 75 or data.get("minimumSectionPercent") != 50:
        errors.append(f"{rel}: passing rules must require 75 overall and 50 percent per section")


def main() -> int:
    errors: list[str] = []
    validate_assessment(errors)
    # README files describe folders rather than individual content records and
    # intentionally do not carry content frontmatter.
    pages = sorted(path for path in CONTENT.rglob("*.md") if path.name.lower() != "readme.md")
    by_command: dict[str, set[str]] = {}
    cheat_sheets: list[tuple[Path, dict[str, object], str]] = []
    cheat_sheet_command_counts: dict[str, int] = {}
    linked_cheatsheet_guides: set[tuple[object, str, str]] = set()
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
                    {"id", "title", "type", "stage", "difficulty", "summary", "objectives", "prerequisites", "starting_files"}
                    if kind == "challenge" else
                    {"id", "title", "type", "stage", "summary", "commands"})
        for key in sorted(required - meta.keys()):
            errors.append(f"{rel}: missing required field {key}")
        if kind not in ENUMS["type"]:
            errors.append(f"{rel}: type must be command, challenge, or cheatsheet")
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
        elif kind == "cheatsheet":
            stage = meta.get("stage")
            stage_slug = STAGE_SLUGS.get(stage) if isinstance(stage, int) else None
            for field in ("id", "title", "summary"):
                if not isinstance(meta.get(field), str) or not meta[field].strip():
                    errors.append(f"{rel}: {field} must be a non-empty string")
            if stage_slug is None:
                errors.append(f"{rel}: cheat sheet stage must be from 1 to 5")
            elif meta.get("id") != stage_slug or path.name != f"{stage_slug}.md":
                errors.append(f"{rel}: cheat sheet id and filename must match stage slug {stage_slug}")
            commands = meta.get("commands")
            if not isinstance(commands, list) or not commands or any(not isinstance(item, str) for item in commands):
                errors.append(f"{rel}: commands must be a non-empty list of command IDs")
                commands = []
            if len(set(commands)) != len(commands):
                errors.append(f"{rel}: command references must be unique")
            if any(not re.search(r"^##\s+" + re.escape(section) + r"\s*$", body, re.M) for section in CHEATSHEET_SECTIONS):
                missing = sorted(section for section in CHEATSHEET_SECTIONS
                                 if not re.search(r"^##\s+" + re.escape(section) + r"\s*$", body, re.M))
                errors.append(f"{rel}: missing required sections: {', '.join(missing)}")
            if isinstance(stage, int):
                for command in commands:
                    if command not in COMMANDS:
                        errors.append(f"{rel}: unknown command reference {command!r}")
                    elif COMMAND_STAGE.get(command) != stage:
                        errors.append(f"{rel}: command {command!r} does not belong to stage {stage}")
                    else:
                        cheat_sheet_command_counts[command] = cheat_sheet_command_counts.get(command, 0) + 1
            cheat_sheets.append((path, meta, body))
        for target in re.findall(r"\[[^\]]*\]\(([^)#]+)(?:#[^)]*)?\)", body):
            if re.match(r"^(?:[a-z]+:|//|#)", target, re.I):
                continue
            resolved = (path.parent / target.split("?", 1)[0]).resolve()
            if not resolved.is_file():
                errors.append(f"{rel}: broken local link {target!r}")
            elif kind == "cheatsheet":
                try:
                    relative = resolved.relative_to(CONTENT.resolve()).as_posix()
                except ValueError:
                    errors.append(f"{rel}: local link escapes content/: {target!r}")
                    continue
                guide = re.fullmatch(r"stages/(\d{2}-[a-z0-9-]+)/([a-z0-9-]+)\.(detailed|revision)\.md", relative)
                if guide:
                    stage_slug, command_id, mode = guide.groups()
                    if command_id not in COMMANDS:
                        errors.append(f"{rel}: guide link names unknown command {command_id!r}")
                    elif stage_slug != meta.get("id"):
                        errors.append(f"{rel}: guide link for {command_id!r} points to a different stage")
                    else:
                        link_key = (meta.get("id"), command_id, mode)
                        linked_cheatsheet_guides.add(link_key)
    for command_id, modes in sorted(by_command.items()):
        if modes != {"detailed", "revision"}:
            errors.append(f"command {command_id}: expected detailed and revision files; found {sorted(modes)}")
    sheet_stages: set[int] = set()
    for path, meta, _body in cheat_sheets:
        stage = meta.get("stage")
        if isinstance(stage, int):
            if stage in sheet_stages:
                errors.append(f"{path.relative_to(ROOT).as_posix()}: duplicate cheat sheet for stage {stage}")
            sheet_stages.add(stage)
            commands = meta.get("commands") if isinstance(meta.get("commands"), list) else []
            for command in commands:
                for mode in ("detailed", "revision"):
                    if (meta.get("id"), command, mode) not in linked_cheatsheet_guides:
                        errors.append(f"{path.relative_to(ROOT).as_posix()}: missing {mode} guide link for {command}")
    for stage in STAGE_SLUGS:
        if stage not in sheet_stages:
            errors.append(f"missing cheat sheet for stage {stage}")
        for command in STAGE_COMMANDS[stage]:
            count = cheat_sheet_command_counts.get(command, 0)
            if count != 1:
                errors.append(f"command {command}: expected one cheat sheet reference, found {count}")
    if errors:
        print("Content validation failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print(f"Content validation passed: {len(pages)} Markdown page(s), {len(by_command)} complete command pair(s), five stage cheat sheets, and the 100-point final assessment.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
