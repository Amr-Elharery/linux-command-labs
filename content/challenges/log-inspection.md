---
id: log-inspection
title: "Log Inspection"
type: challenge
stage: 2
difficulty: beginner
summary: "Investigate synthetic application and authentication logs using safe read-only commands."
objectives: ["Inspect log beginnings and endings", "Navigate a log with a pager", "Use line numbers to cite records", "Distinguish synthetic application and authentication events"]
prerequisites: [cat, more, less, head, tail, nl]
starting_files: [playground/logs/app.log, playground/logs/auth.log]
---

# Log Inspection

## Scenario

A teammate reports a delayed service request and asks whether the synthetic authentication log shows related activity. Inspect the repository's two sample logs and prepare a short, line-referenced summary. These files contain fictional records only; do not inspect host authentication logs.

## Task requirements

1. Confirm you are at the repository root with `pwd`, then use `ls -l playground/logs` to identify the available fixtures.
2. Use `head` to inspect the first two application events and `tail` to inspect the latest three.
3. Use `nl -ba playground/logs/app.log` to identify the line number of the error and latest warning.
4. Page through `auth.log` with `less` or `more`; use `nl -ba` to cite the accepted-key and failed-login records.
5. Use a pipeline such as `cat playground/logs/auth.log | tail -n 2` to inspect the final two records.
6. Report the error line, the final application severity, how many failed-password records appear, and which line reports an accepted public key.

## Constraints

- Read only `playground/logs/app.log` and `playground/logs/auth.log`.
- Do not edit, append to, or redirect output over either file.
- Do not read `/var/log/auth.log`, `/var/log/secure`, or other host logs.
- In an interactive pager, quit with `q`; stop any live follower with Ctrl+C. The supplied logs are static, so no follow mode is required here.

## Progressive hints

<details>
<summary>Hint 1 — inspect the application timeline</summary>

`head -n 2` shows the first events. `tail -n 3` shows the final warning/error sequence. Use `nl -ba` on the full file if you need its original line numbers.
</details>

<details>
<summary>Hint 2 — inspect authentication records</summary>

`auth.log` has four lines. Number them with `nl -ba`; look for the literal phrases `Failed password` and `Accepted publickey`.
</details>

<details>
<summary>Hint 3 — summarize without changing files</summary>

The application error is on line 4 and the final record is a warning. The authentication fixture contains two failed-password records; the accepted public key is line 2.
</details>

## Expected result

The application error says `request timed out` on line 4, followed by a `WARN` line 5. The authentication log contains two failed-password records (lines 1 and 3), one accepted-publickey record (line 2), and one synthetic local-command record (line 4). The source files remain unchanged.

## Solution

<details>
<summary>Show solution</summary>

Run from the repository root:

```bash
pwd
ls -l playground/logs
head -n 2 playground/logs/app.log
tail -n 3 playground/logs/app.log
nl -ba playground/logs/app.log
less -F -X playground/logs/auth.log
nl -ba playground/logs/auth.log
cat playground/logs/auth.log | tail -n 2
```

The short file fits in `less -F -X` and exits without an interactive prompt. In an ordinary interactive session, `less playground/logs/auth.log` lets you search and move around; press `q` to leave. The two failed-password entries are lines 1 and 3; the accepted key is line 2. The app error is line 4 and the latest event is a warning on line 5.
</details>

## Reset

This challenge is read-only and needs no reset. If another practice task modified generated fixtures, restore them from the repository root with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.
