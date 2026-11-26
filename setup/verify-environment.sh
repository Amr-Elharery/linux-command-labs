#!/usr/bin/env bash
set -u

printf 'Linux Labs environment verification\n'
printf '===============================\n'
if [[ -r /etc/os-release ]]; then
  # This is the host-maintained operating-system identification file.
  . /etc/os-release
  printf 'Distribution: %s\n' "${PRETTY_NAME:-${NAME:-unknown}}"
else
  printf 'Distribution: unknown (/etc/os-release unavailable)\n'
fi
if command -v uname >/dev/null 2>&1; then
  printf 'Kernel: %s\n' "$(uname -srm)"
else
  printf 'Kernel: uname unavailable\n'
fi
printf 'Shell: %s\n' "${BASH_VERSION:-unknown}"
printf '\nRequired command availability\n'

required=(bash pwd ls cd mkdir cp mv rm cat more less head tail nl which whereis find grep wc cut sort uniq tr diff join xargs awk top free df du time realpath mktemp)
missing=0
for command_name in "${required[@]}"; do
  if command -v "$command_name" >/dev/null 2>&1; then
    printf '  [ok]      %s\n' "$command_name"
  else
    printf '  [missing] %s\n' "$command_name"
    missing=1
  fi
done

printf '\nSelected tool versions\n'
for command_name in bash find grep awk sort realpath; do
  if ! command -v "$command_name" >/dev/null 2>&1; then continue; fi
  case "$command_name" in
    awk) version_output="$($command_name -W version 2>&1 | head -n 1 || true)" ;;
    *) version_output="$($command_name --version 2>&1 | head -n 1 || true)" ;;
  esac
  printf '  %s: %s\n' "$command_name" "${version_output:-version unavailable}"
done

if [[ "$missing" -ne 0 ]]; then
  printf '\nSome commands are missing. Install them through your normal distribution process; this script makes no system changes.\n' >&2
  exit 1
fi
printf '\nAll required commands are available. No system changes were made.\n'
