# Indexer

Local-only media indexer following the usual gotro project shape:

- `conf/` for environment parsing
- `domain/` for indexing and file-management logic
- `model/` for ClickHouse access and migrations
- `presentation/` for web and CLI entrypoints
- `svelte/` for the local UI
- `migrations/` for incremental schema changes

This project intentionally excludes login/register because it is meant to run only on the local machine.

## Purpose

1. Index files and directories from `.env` into ClickHouse for fast search.
2. Suggest better directory naming based on the target media naming pattern.
3. Move, rename, and delete files or directories with explicit confirmation.
4. Detect likely duplicates by sampled file fingerprint.
5. Reindex efficiently and resumably across multiple configured roots.

## Configuration

`.env` uses one configured directory per line inside the multiline values:

```env
PASSWORD=example
WEB_ADDR=:18080

SORTED_MOVIES="
/path/to/sorted/root-a
/path/to/sorted/root-b
"

UNSORTED_MOVIES="
/path/to/unsorted/root-a
/path/to/unsorted/root-b
"
```

Secrets or machine-specific overrides should go into `.env.override` in the project root. It is loaded after `.env`, overrides matching keys, and is ignored by Git. A committed template is provided at `.env.override.example`.

Example `.env.override`:

```env
PASSWORD=your-real-local-password
CLICKHOUSE_PASSWORD=your-real-clickhouse-password
```

Optional ClickHouse overrides:

```env
CLICKHOUSE_URL=http://127.0.0.1:8127
CLICKHOUSE_DB=indexer
CLICKHOUSE_USER=userC
CLICKHOUSE_PASSWORD=passC
MOVIES_EXTS="mkv avi mpg mpeg mp4 m4v mov webm wmv"
SUBTITLE_EXTS="sub idx srt"
```

## How It Works

1. `web` or `cli` mode starts local ClickHouse through `docker compose`.
2. Incremental SQL migrations are applied from `migrations/`.
3. Reindex walks configured roots and stores searchable directory names plus configured video file extensions into ClickHouse.
4. Reindex state is checkpointed into `_tmpdb/` so interrupted runs can resume.
5. Search is available from both the web UI and CLI.
6. Browse is restricted to configured roots only, so it cannot move upward outside the configured roots and cannot expose `.env` or `.env.override` secrets.

## Indexing Behavior

- Parallelized by mount point.
- Roots on the same mount stay serialized to avoid fighting the same disk.
- Mount information is derived from `/proc/mounts` and `/etc/fstab`.
- File hashing is skipped when `size` and `mtime` match the previous entry.
- Unchanged directories are reused as metadata when directory `mtime` is safe to trust for that mount.
- Progress is tracked:
  - globally by bytes
  - per mount point by bytes
  - per configured root by bytes

## CLI

```sh
go run main.go cli reindex
go run main.go cli reindex /path/to/priority/root-a /path/to/priority/root-b
go run main.go cli search "kensei"
go run main.go cli browse
go run main.go cli browse "/path/to/configured/root"
go run main.go cli duplicates
go run main.go cli suggest "/path/to/Series.Name.S01.[12Ew0]"
```

## Web

```sh
go run main.go web
```

The UI shows:

- tabbed browse / indexer / search / duplicates / manage views
- global reindex progress
- mount-point progress tree
- configured-root progress tree
- restricted browse tree for configured roots
- search table
- duplicate detection
- rename suggestion
- move / rename / delete actions

## Migrations

Schema changes are incremental.

- Applied migration filenames are tracked in the `schema_migrations` ClickHouse table.
- New SQL files in `migrations/` are applied in sorted filename order.
- Existing migrations are not re-run once recorded.
- The `entries` engine evolves incrementally to `ReplacingMergeTree(modified_at)` through a later migration instead of rewriting the original schema file.

Current main schema:

### `schema_migrations`

| Column | Type | Purpose |
|---|---|---|
| `version` | `String` | applied migration filename |
| `applied_at` | `DateTime` | applied timestamp |

### `entries`

| Column | Type | Purpose |
|---|---|---|
| `path` | `String` | absolute indexed path |
| `dir` | `String` | parent directory |
| `base` | `String` | basename |
| `ext` | `String` | lowercase extension |
| `root` | `String` | configured root that owns this path |
| `rootKind` | `LowCardinality(String)` | `sorted` or `unsorted` |
| `is_dir` | `UInt8` | directory flag |
| `size` | `Int64` | file size |
| `modified_at` | `DateTime64(3)` | modification time |
| `fingerprint` | `String` | sampled file fingerprint |
| `content` | `String` | normalized searchable text |
| `subtree_size` | `Int64` | aggregated descendant file bytes for directories |
| `subtree_files` | `Int32` | aggregated descendant file count for directories |
| `subtree_dirs` | `Int32` | aggregated descendant directory count for directories |

Engine: `ReplacingMergeTree(modified_at)` with `ORDER BY path`

## Make Targets

```sh
make web
make air
make migrate
make clickhouse
make cli-reindex
make cli-search q="kensei"
make svelte-watch
```

## Notes

- File-management actions are protected by the local password loaded from `.env.override` when present, otherwise `.env`.
- Symlinks are not treated specially for duplicate removal logic.
- Reindex currently rewrites the `entries` table contents after a completed run, but schema evolution itself is incremental and tracked separately through migrations.
