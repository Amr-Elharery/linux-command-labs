# Playground setup and safety

The playground contains synthetic, deterministic practice material. The committed `playground/logs/app.log` is the original representative fixture; setup and reset preserve it. Setup owns only the additional paths enumerated in `setup/setup.sh` and reset removes only those paths.

## Prerequisites

- Kali Linux or Ubuntu 22.04 (other GNU/Linux distributions may work).
- Bash and Git.
- The commands checked by `setup/verify-environment.sh`; missing commands are reported, never installed automatically.

## Clone and initialize

```bash
git clone <repository-url>
cd linux-command-labs
bash setup/verify-environment.sh
bash setup/setup.sh
```

Both scripts locate the repository from their own file path, so they can also be invoked by absolute path from another current directory. Setup can be rerun: the managed files are atomically replaced with the same fixed contents. It preserves any existing regular `playground/logs/app.log`; if that fixture is missing, setup restores its known sample. Setup refuses symlinks at managed directory and file paths. Atomic replacement also avoids writing through an unexpected hard link.

Generated fixtures include:

- `playground/logs/auth.log`: synthetic authentication events using documentation-only IP ranges; it contains no passwords or credentials.
- `playground/data/employees.csv`, `transactions.csv`, and `departments.csv`: small fictional datasets.
- `playground/projects/atlas/`: text and configuration-like files with no secrets.
- `playground/backups/atlas-backup-note.txt`: a text-only sample backup note.

## Reset

```bash
bash setup/reset-lab.sh
# For an intentional non-interactive reset:
bash setup/reset-lab.sh --yes
```

The interactive form defaults to cancel. `--yes` is the explicit confirmation for automated use. Reset validates the physical repository and playground paths, rejects symlinked managed paths, unlinks only its enumerated generated files, and attempts to remove only empty sample project subdirectories. It preserves `app.log`, top-level playground directories, and any unrecognized files. It never uses `sudo` and never targets system paths.

## Safety boundaries

- Keep lab work under this repository's `playground/` tree.
- Do not place credentials, personal logs, or private data in fixtures.
- Do not manually replace managed fixture paths with symlinks; the scripts stop rather than follow them.
- Reset is intentionally conservative: unknown files are left in place, even inside the generated project directory.
- Setup/reset depend on GNU `realpath` for canonical path validation, available on Kali and Ubuntu 22.04.

## Validation

Run the content metadata checker with Python 3:

```bash
python3 scripts/validate_content.py
```

Run playground lifecycle checks in a disposable temporary copy:

```bash
bash scripts/test_playground.sh
```

The lifecycle test checks two consecutive setup runs, preservation of `app.log`, generated fixture contents, reset followed by setup from another working directory, preservation of an unrelated file, rejection of symlinked playground/subdirectory/fixture paths, and safe replacement of a hard-linked fixture. It creates and removes only its own temporary test directory.
