CREATE TABLE IF NOT EXISTS manage_history (
  id String,
  action LowCardinality(String),
  status LowCardinality(String),
  src_path String,
  dst_path String,
  message String,
  created_at DateTime64(3),
  started_at DateTime64(3),
  finished_at DateTime64(3)
) ENGINE = ReplacingMergeTree(finished_at)
ORDER BY (created_at, id);
