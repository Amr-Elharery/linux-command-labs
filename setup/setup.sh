#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"
PLAYGROUND="$REPO_ROOT/playground"

fail() { printf 'setup: %s\n' "$*" >&2; exit 1; }

# Only operate on the exact playground directory in this checkout. Reject a
# symlink at every managed directory boundary before creating or writing files.
[[ ! -L "$PLAYGROUND" ]] || fail "refusing symlinked playground directory: $PLAYGROUND"
[[ "$(realpath -m -- "$PLAYGROUND")" == "$REPO_ROOT/playground" ]] || fail "playground path failed validation"

for relative in playground playground/logs playground/data playground/projects playground/backups \
  playground/projects/atlas playground/projects/atlas/src playground/projects/atlas/config; do
  path="$REPO_ROOT/$relative"
  [[ ! -L "$path" ]] || fail "refusing symlinked managed path: $path"
  if [[ -e "$path" && ! -d "$path" ]]; then fail "expected a directory: $path"; fi
done

managed_files=(
  logs/app.log logs/auth.log data/employees.csv data/transactions.csv data/departments.csv
  projects/atlas/README.md projects/atlas/src/README.txt projects/atlas/src/tasks.txt
  projects/atlas/config/app.conf backups/atlas-backup-note.txt
)
for relative in "${managed_files[@]}"; do
  path="$PLAYGROUND/$relative"
  [[ ! -L "$path" ]] || fail "refusing symlinked fixture: $path"
  if [[ -e "$path" && ! -f "$path" ]]; then fail "expected a regular fixture file: $path"; fi
done

mkdir -p -- "$PLAYGROUND/logs" "$PLAYGROUND/data" "$PLAYGROUND/projects/atlas/src" \
  "$PLAYGROUND/projects/atlas/config" "$PLAYGROUND/backups"

write_fixture() {
  local relative="$1"
  local destination="$PLAYGROUND/$relative"
  local temporary
  [[ ! -L "$destination" ]] || fail "refusing symlinked fixture: $destination"
  temporary="$(mktemp "${destination}.tmp.XXXXXX")"
  if ! cat > "$temporary"; then
    rm -f -- "$temporary"
    fail "could not write fixture: $destination"
  fi
  # Rename within the validated directory so replacing a pre-existing hard
  # link cannot write through to another path.
  mv -f -- "$temporary" "$destination"
}

# app.log predates setup and is a canonical tracked fixture. Preserve any
# existing regular file; restore its known sample only if it is absent.
if [[ ! -e "$PLAYGROUND/logs/app.log" ]]; then
  write_fixture logs/app.log <<'EOF'
2025-03-08T09:12:00Z INFO service started
2025-03-08T09:13:10Z DEBUG cache lookup complete
2025-03-08T09:14:00Z WARN cache refresh delayed
2025-03-08T09:15:15Z ERROR request timed out
2025-03-08T09:16:30Z WARN retry limit approaching
EOF
fi
[[ ! -L "$PLAYGROUND/logs/app.log" ]] || fail "refusing symlinked fixture: $PLAYGROUND/logs/app.log"

write_fixture logs/auth.log <<'EOF'
Mar 08 09:20:00 lab-host sshd[4101]: Failed password for synthetic-user from 192.0.2.10 port 2201 ssh2
Mar 08 09:21:12 lab-host sshd[4102]: Accepted publickey for synthetic-user from 192.0.2.11 port 2202 ssh2
Mar 08 09:22:44 lab-host sshd[4103]: Failed password for guest from 198.51.100.23 port 2203 ssh2
Mar 08 09:24:01 lab-host sudo[4104]: synthetic-user : command allowed ; TTY=pts/0 ; COMMAND=/usr/bin/id
EOF

write_fixture data/employees.csv <<'EOF'
employee_id,name,department,role,status
E1001,Synthetic User One,Engineering,Analyst,active
E1002,Synthetic User Two,Support,Technician,active
E1003,Synthetic User Three,Engineering,Developer,inactive
E1004,Synthetic User Four,Finance,Analyst,active
E1005,Synthetic User Five,Support,Developer,active
EOF

write_fixture data/transactions.csv <<'EOF'
transaction_id,account_id,item,quantity,amount,status
T5001,A100,notebook,3,12.75,complete
T5002,A101,adapter,1,18.50,pending
T5003,A100,pen,10,5.00,complete
T5004,A102,notebook,2,8.50,failed
T5005,A103,adapter,2,37.00,complete
EOF

write_fixture data/departments.csv <<'EOF'
department_id,department_name,manager_id
D10,Engineering,E1001
D20,Support,E1002
D30,Finance,E1004
EOF

write_fixture projects/atlas/README.md <<'EOF'
# Atlas Sample Project

A synthetic project tree for Linux Labs filesystem exercises. All names and data are fictional.

- `src/`: small text fixtures for inspection and search.
- `config/`: configuration-like sample text; it contains no secrets.
EOF

write_fixture projects/atlas/src/README.txt <<'EOF'
Atlas source notes
------------------
Build: local-demo
Owner: Synthetic User One
Status: prototype
EOF

write_fixture projects/atlas/src/tasks.txt <<'EOF'
1. inspect the sample configuration
2. summarize synthetic transactions
3. compare the two release notes
EOF

write_fixture projects/atlas/config/app.conf <<'EOF'
app_name=atlas-demo
log_level=INFO
retry_limit=3
endpoint=https://service.example.invalid/api
EOF

write_fixture backups/atlas-backup-note.txt <<'EOF'
Synthetic backup note
Project: atlas-demo
Snapshot: sample-01
Contents: text fixtures only
EOF

printf 'Playground fixtures are ready at %s\n' "$PLAYGROUND"
printf 'All generated data is synthetic. Re-run setup safely to restore managed fixtures.\n'
