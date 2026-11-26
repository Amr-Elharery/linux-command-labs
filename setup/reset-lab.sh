#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"
PLAYGROUND="$REPO_ROOT/playground"

fail() { printf 'reset: %s\n' "$*" >&2; exit 1; }

case "${1-}" in
  "")
    if [[ ! -t 0 ]]; then fail "non-interactive use requires --yes"; fi
    read -r -p "Remove generated Linux Labs fixtures from $PLAYGROUND? [y/N] " answer
    [[ "$answer" == [yY] || "$answer" == [yY][eE][sS] ]] || { printf 'Reset cancelled.\n'; exit 0; }
    ;;
  --yes) ;;
  *) fail "usage: $0 [--yes]" ;;
esac

[[ ! -L "$PLAYGROUND" ]] || fail "refusing symlinked playground directory: $PLAYGROUND"
[[ "$(realpath -m -- "$PLAYGROUND")" == "$REPO_ROOT/playground" ]] || fail "playground path failed validation"
[[ -d "$PLAYGROUND" ]] || fail "playground directory does not exist"
[[ ! -L "$PLAYGROUND/logs/app.log" ]] || fail "refusing symlinked preserved fixture: $PLAYGROUND/logs/app.log"
if [[ -e "$PLAYGROUND/logs/app.log" && ! -f "$PLAYGROUND/logs/app.log" ]]; then
  fail "expected a regular preserved fixture: $PLAYGROUND/logs/app.log"
fi

managed_dirs=(logs data projects backups projects/atlas projects/atlas/src projects/atlas/config)
for relative in "${managed_dirs[@]}"; do
  path="$PLAYGROUND/$relative"
  [[ ! -L "$path" ]] || fail "refusing symlinked managed path: $path"
  if [[ -e "$path" && ! -d "$path" ]]; then fail "expected a directory: $path"; fi
done

# Remove only fixtures owned by setup. app.log is the original tracked fixture
# and is deliberately retained. rm unlinks a path itself; it never follows it,
# but symlinks at managed file paths are rejected above for an explicit stop.
managed_files=(
  logs/auth.log
  data/employees.csv
  data/transactions.csv
  data/departments.csv
  projects/atlas/README.md
  projects/atlas/src/README.txt
  projects/atlas/src/tasks.txt
  projects/atlas/config/app.conf
  backups/atlas-backup-note.txt
)
for relative in "${managed_files[@]}"; do
  path="$PLAYGROUND/$relative"
  [[ ! -L "$path" ]] || fail "refusing symlinked fixture: $path"
  if [[ -e "$path" && ! -f "$path" ]]; then fail "expected a regular fixture file: $path"; fi
done

for relative in "${managed_files[@]}"; do
  path="$PLAYGROUND/$relative"
  if [[ -f "$path" ]]; then rm -- "$path"; fi
done

# Remove only now-empty sample project directories; preserve unknown files and
# all top-level playground directories, including any user-created content.
for relative in projects/atlas/src projects/atlas/config projects/atlas; do
  path="$PLAYGROUND/$relative"
  if [[ -d "$path" ]]; then rmdir -- "$path" 2>/dev/null || true; fi
done

printf 'Generated fixtures removed. Preserved %s and all unrelated files.\n' "$PLAYGROUND/logs/app.log"
