#!/usr/bin/env bash
set -Eeuo pipefail

SOURCE_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/linux-labs-test.XXXXXX")"
cleanup() { rm -rf -- "$TEST_ROOT"; }
trap cleanup EXIT

pass() { printf '[PASS] %s\n' "$*"; }
fail() { printf '[FAIL] %s\n' "$*" >&2; exit 1; }
copy_minimal_repo() {
  local target="$1"
  mkdir -p -- "$target/setup" "$target/playground"
  cp -- "$SOURCE_ROOT/setup/setup.sh" "$SOURCE_ROOT/setup/reset-lab.sh" "$target/setup/"
  cp -a -- "$SOURCE_ROOT/playground/." "$target/playground/"
}
snapshot() {
  (cd -- "$1" && find playground -type f -print0 | sort -z | xargs -0 sha256sum)
}

repo="$TEST_ROOT/repo"
copy_minimal_repo "$repo"
original_log="$TEST_ROOT/original-app.log"
cp -- "$repo/playground/logs/app.log" "$original_log"

bash "$repo/setup/setup.sh" >/dev/null
snapshot "$repo" > "$TEST_ROOT/first.snapshot"
bash "$repo/setup/setup.sh" >/dev/null
snapshot "$repo" > "$TEST_ROOT/second.snapshot"
cmp -s "$TEST_ROOT/first.snapshot" "$TEST_ROOT/second.snapshot" || fail 'setup changed fixture bytes on second run'
pass 'setup is idempotent across two runs'
cmp -s "$original_log" "$repo/playground/logs/app.log" || fail 'setup changed the original app.log fixture'
pass 'existing app.log fixture is preserved'

[[ "$(wc -l < "$repo/playground/data/employees.csv")" -eq 6 ]] || fail 'employee dataset row count mismatch'
[[ "$(wc -l < "$repo/playground/data/transactions.csv")" -eq 6 ]] || fail 'transaction dataset row count mismatch'
[[ "$(wc -l < "$repo/playground/logs/auth.log")" -eq 4 ]] || fail 'authentication fixture row count mismatch'
grep -Fq '192.0.2.10' "$repo/playground/logs/auth.log" || fail 'synthetic documentation-range address missing'
grep -Fq 'Synthetic User One' "$repo/playground/data/employees.csv" || fail 'synthetic employee fixture missing'
grep -Fq 'A100,notebook' "$repo/playground/data/transactions.csv" || fail 'synthetic transaction fixture missing'
[[ -f "$repo/playground/projects/atlas/src/tasks.txt" && -f "$repo/playground/backups/atlas-backup-note.txt" ]] || fail 'project fixtures missing'
pass 'synthetic logs, datasets, project files, and backup note match expected fixtures'

printf 'keep this unrelated file\n' > "$repo/playground/data/keep-user.txt"
(cd -- "$TEST_ROOT" && bash "$repo/setup/reset-lab.sh" --yes >/dev/null)
[[ -f "$repo/playground/logs/app.log" ]] || fail 'reset removed app.log'
cmp -s "$original_log" "$repo/playground/logs/app.log" || fail 'reset changed app.log'
[[ -f "$repo/playground/data/keep-user.txt" ]] || fail 'reset removed unrelated user content'
[[ ! -e "$repo/playground/data/employees.csv" && ! -e "$repo/playground/logs/auth.log" ]] || fail 'reset left managed fixtures behind'
[[ ! -e "$repo/playground/projects/organization-lab" ]] || fail 'reset left the disposable organization workspace behind'
pass 'reset removes only managed generated files and retains original/unrelated files'
bash "$repo/setup/setup.sh" >/dev/null
[[ -f "$repo/playground/data/employees.csv" ]] || fail 'setup after reset failed to restore data'
[[ -f "$repo/playground/projects/organization-lab/inbox/quarterly report.txt" ]] || fail 'setup did not restore disposable organization workspace'
pass 'setup restores generated fixtures after reset'

(cd -- "$TEST_ROOT" && bash "$repo/setup/setup.sh" >/dev/null)
[[ -f "$repo/playground/projects/atlas/config/app.conf" ]] || fail 'setup failed from a different working directory'
pass 'setup works when invoked outside the repository root'

outside="$TEST_ROOT/outside"
mkdir -p -- "$outside"
printf 'outside sentinel\n' > "$outside/sentinel.txt"
bad="$TEST_ROOT/bad-root"
mkdir -p -- "$bad/setup"
cp -- "$repo/setup/setup.sh" "$repo/setup/reset-lab.sh" "$bad/setup/"
ln -s -- "$outside" "$bad/playground"
if bash "$bad/setup/setup.sh" >/dev/null 2>&1; then fail 'setup accepted a symlinked playground'; fi
if bash "$bad/setup/reset-lab.sh" --yes >/dev/null 2>&1; then fail 'reset accepted a symlinked playground'; fi
[[ "$(cat "$outside/sentinel.txt")" == 'outside sentinel' ]] || fail 'symlink path validation touched outside data'
pass 'setup/reset reject a playground symlink without touching its target'

child="$TEST_ROOT/child-root"
mkdir -p -- "$child/setup" "$child/playground/logs" "$child/playground/projects" "$child/playground/backups"
cp -- "$repo/setup/setup.sh" "$repo/setup/reset-lab.sh" "$child/setup/"
ln -s -- "$outside" "$child/playground/data"
if bash "$child/setup/setup.sh" >/dev/null 2>&1; then fail 'setup accepted a symlinked managed subdirectory'; fi
[[ "$(cat "$outside/sentinel.txt")" == 'outside sentinel' ]] || fail 'subdirectory symlink validation touched outside data'
pass 'setup rejects symlinked managed subdirectories'

workspace_link_root="$TEST_ROOT/workspace-link-root"
mkdir -p -- "$workspace_link_root/setup" "$workspace_link_root/playground/projects"
cp -- "$repo/setup/setup.sh" "$repo/setup/reset-lab.sh" "$workspace_link_root/setup/"
ln -s -- "$outside" "$workspace_link_root/playground/projects/organization-lab"
if bash "$workspace_link_root/setup/setup.sh" >/dev/null 2>&1; then fail 'setup accepted a symlinked organization workspace'; fi
if bash "$workspace_link_root/setup/reset-lab.sh" --yes >/dev/null 2>&1; then fail 'reset accepted a symlinked organization workspace'; fi
[[ "$(cat "$outside/sentinel.txt")" == 'outside sentinel' ]] || fail 'workspace symlink validation touched outside data'
pass 'setup/reset reject a symlinked disposable workspace'

marker_root="$TEST_ROOT/marker-root"
mkdir -p -- "$marker_root/setup" "$marker_root/playground/projects/organization-lab"
cp -- "$repo/setup/setup.sh" "$repo/setup/reset-lab.sh" "$marker_root/setup/"
printf 'not the Linux Labs marker\n' > "$marker_root/playground/projects/organization-lab/.linux-labs-reset-marker"
if bash "$marker_root/setup/setup.sh" >/dev/null 2>&1; then fail 'setup accepted a mismatched workspace marker'; fi
if bash "$marker_root/setup/reset-lab.sh" --yes >/dev/null 2>&1; then fail 'reset accepted a mismatched workspace marker'; fi
[[ -f "$marker_root/playground/projects/organization-lab/.linux-labs-reset-marker" ]] || fail 'marker validation removed workspace contents'
pass 'setup/reset refuse to remove a workspace with an invalid marker'

nested_link_root="$TEST_ROOT/nested-link-root"
copy_minimal_repo "$nested_link_root"
ln -s -- "$outside/sentinel.txt" "$nested_link_root/playground/projects/organization-lab/outside-link"
bash "$nested_link_root/setup/reset-lab.sh" --yes >/dev/null
[[ "$(cat "$outside/sentinel.txt")" == 'outside sentinel' ]] || fail 'reset followed a nested workspace symlink'
pass 'reset unlinks nested workspace symlinks without following their targets'

fixture="$TEST_ROOT/file-root"
copy_minimal_repo "$fixture"
mkdir -p -- "$fixture/playground/data"
rm -f -- "$fixture/playground/data/employees.csv"
ln -s -- "$outside/sentinel.txt" "$fixture/playground/data/employees.csv"
if bash "$fixture/setup/setup.sh" >/dev/null 2>&1; then fail 'setup accepted a symlinked generated file'; fi
if bash "$fixture/setup/reset-lab.sh" --yes >/dev/null 2>&1; then fail 'reset accepted a symlinked generated file'; fi
[[ "$(cat "$outside/sentinel.txt")" == 'outside sentinel' ]] || fail 'fixture symlink handling touched its target'
pass 'setup/reset reject symlinked generated files without following them'

hardlink_repo="$TEST_ROOT/hardlink-root"
copy_minimal_repo "$hardlink_repo"
mkdir -p -- "$hardlink_repo/playground/data"
rm -f -- "$hardlink_repo/playground/data/employees.csv"
ln -- "$outside/sentinel.txt" "$hardlink_repo/playground/data/employees.csv"
bash "$hardlink_repo/setup/setup.sh" >/dev/null
[[ "$(cat "$outside/sentinel.txt")" == 'outside sentinel' ]] || fail 'setup wrote through a hard-linked fixture'
grep -Fq 'Synthetic User One' "$hardlink_repo/playground/data/employees.csv" || fail 'setup did not replace hard-linked fixture atomically'
pass 'setup atomically replaces a hard-linked fixture without altering its other link'

printf '\nAll playground tests passed.\n'
