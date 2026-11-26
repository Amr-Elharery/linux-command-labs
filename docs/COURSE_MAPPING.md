# Original Course Mapping

The source course description reports **31 guided labs and 10 challenges (41 activities)**. The supplied project brief provides the command lists below and a set of 9 named combined scenario headlines, but it does not supply a numbered activity list or classify each headline as a guided lab or challenge. The mapping therefore preserves the given titles and marks uncertain assignments rather than manufacturing a 41-row syllabus.

## Stage and command coverage

| Stage | Supplied commands/topics | Named supplied activity headline(s) |
|---|---|---|
| 01 — File System Operations | `ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, `rm` | Content Listing; Directory Displaying; Directory Changing; Directory Creating; Setting Up a New Project Structure; File Copying; File Moving and Renaming; File Removing; Organizing Files and Directories |
| 02 — File Content Operations | `cat`, `more`, `less`, `head`, `tail`, `nl` | File Concatenating; File Scrolling; File Paging; Viewing Log and Configuration Files in Linux; File Beginning Display; File End Display; Line Numbering; Rapid Threat Detection |
| 03 — File Search | `which`, `whereis`, `find` | Command Locating; File and Command Finding; File Searching; Discover Critical System Resources |
| 04 — Text Processing | `grep`, `wc`, `cut`, `sort`, `uniq`, `tr`, `diff`, `join`, `xargs`, `awk` | Pattern Searching; Needle in the Haystack; Text Counting; Text Cutting; Text Sorting; Duplicate Filtering; Character Translating; File Comparing; File Joining; Command Building; Text Processing; Word Count and Sorting; Processing Employees Data |
| 05 — System Information | `top`, `free`, `df`, `du`, `time` | Real-time System Monitoring; Monitoring System Memory; Disk Space Reporting; File Space Estimating; Disk Usage Detective; Command Timing |

## Activity reconciliation

| Source fact | Status | Notes |
|---|---|---|
| 31 distinct commands across five stages | Mapped | All command names in the supplied scope appear above. |
| 9 named combined scenario headlines | Mapped as supplied | Headline-to-command associations follow the source brief's existing suggestions; combined scenarios are identified as combined by their multi-command nature. |
| 31 guided labs | Not individually enumerated | No authoritative title list or guided-lab classification was supplied. |
| 10 challenges | Not individually enumerated | The brief names challenge-like scenarios but does not identify which ten are the source challenges. |
| 41 total activities | Unresolved discrepancy | The available headline list yields 40 topic/headline rows in the earlier draft, not an authoritative 41-activity enumeration. The count cannot be reconstructed reliably by counting commands, topics, or scenario headlines. |

**Missing source material:** a numbered list of all 41 activities, including each title and whether it is a guided lab or challenge. Until that is supplied, Linux Labs will map all known command coverage and preserve known headline names, but will not claim one-to-one activity parity. The representative `Log Triage` challenge created for this repository is original sample content; it is not asserted to be a source-course activity.

## Linux Labs authored additions

Milestone 2 adds [`Directory Organization`](../content/challenges/directory-organization.md), an original cumulative practice challenge combining `ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, and `rm`. It is project-authored content and does not fill the outstanding source-course activity discrepancy.

Milestone 3 adds [`Log Inspection`](../content/challenges/log-inspection.md), an original read-only investigation of the synthetic application and authentication fixtures using Stage 02 commands. It is not asserted to be one of the source-course activities.

The File Search milestone adds [`Critical Resource Discovery`](../content/challenges/critical-resource-discovery.md), an original challenge combining PATH lookup and safe searches within the synthetic playground. It does not claim to fill any missing source-course activity.
