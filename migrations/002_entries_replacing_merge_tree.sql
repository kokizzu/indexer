CREATE TABLE IF NOT EXISTS entries_v2 (
  path String,
  dir String,
  base String,
  ext String,
  root String,
  rootKind LowCardinality(String),
  is_dir UInt8,
  size Int64,
  modified_at DateTime64(3),
  fingerprint String,
  content String
) ENGINE = ReplacingMergeTree(modified_at)
ORDER BY path;

INSERT INTO entries_v2
SELECT path, dir, base, ext, root, rootKind, is_dir, size, modified_at, fingerprint, content
FROM entries;

RENAME TABLE entries TO entries_old, entries_v2 TO entries;

DROP TABLE entries_old;
