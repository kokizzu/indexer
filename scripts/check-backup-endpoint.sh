#!/usr/bin/env sh
set -eu

base_url="${INDEXER_URL:-http://127.0.0.1:18081}"

curl -sS -o /dev/null -w 'backup config: HTTP %{http_code}, %{size_download} bytes\n' "$base_url/api/backup/config"
if [ "${CHECK_BACKUP_ESTIMATE:-0}" = "1" ]; then
  curl -sS -o /dev/null -w 'backup estimate limited: HTTP %{http_code}, %{size_download} bytes\n' "$base_url/api/backup/estimate?limit=500"
fi
curl -sS -o /dev/null -w 'index page: HTTP %{http_code}, %{size_download} bytes\n' "$base_url/"
