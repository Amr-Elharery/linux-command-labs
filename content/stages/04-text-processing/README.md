# Stage 04 — Text Processing

Use small tools in pipelines to search, count, extract, sort, compare, join, and summarize synthetic text and data.

## Commands

- [`grep` Detailed](./grep.detailed.md) · [Revision](./grep.revision.md)
- [`wc` Detailed](./wc.detailed.md) · [Revision](./wc.revision.md)
- [`cut` Detailed](./cut.detailed.md) · [Revision](./cut.revision.md)
- [`sort` Detailed](./sort.detailed.md) · [Revision](./sort.revision.md)
- [`uniq` Detailed](./uniq.detailed.md) · [Revision](./uniq.revision.md)
- [`tr` Detailed](./tr.detailed.md) · [Revision](./tr.revision.md)
- [`diff` Detailed](./diff.detailed.md) · [Revision](./diff.revision.md)
- [`join` Detailed](./join.detailed.md) · [Revision](./join.revision.md)
- [`xargs` Detailed](./xargs.detailed.md) · [Revision](./xargs.revision.md)
- [`awk` Detailed](./awk.detailed.md) · [Revision](./awk.revision.md)

## Cumulative challenges

- [Needle in the Haystack](../../challenges/needle-in-the-haystack.md)
- [Word Count and Sorting](../../challenges/word-count-and-sorting.md)
- [Processing Employees Data](../../challenges/processing-employees-data.md)
- [Integrated Pipeline Challenge](../../challenges/integrated-text-pipeline.md)

## Working safely

Run commands from the repository root. Fixtures in `playground/logs/` and `playground/data/` are synthetic. Derived files, if needed, belong under the disposable `playground/projects/organization-lab/` tree. The examples avoid redirection into original fixtures. Reset disposable work with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

Pipelines pass stdout to stdin. The examples use quoted patterns/awk programs and quote paths with spaces. The CSVs are deliberately simple; `cut`, `join`, and `awk -F,` do not implement full CSV quoting rules.
