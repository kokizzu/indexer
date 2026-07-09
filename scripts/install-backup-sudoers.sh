#!/usr/bin/env sh
set -eu

if [ "$(id -u)" != "0" ]; then
  echo "must run as root; use: make install-backup-sudoers" >&2
  exit 1
fi

backup_user="${BACKUP_SUDO_USER:-${SUDO_USER:-}}"
if [ -z "$backup_user" ] || [ "$backup_user" = "root" ]; then
  echo "set BACKUP_SUDO_USER to the non-root web user, or run via sudo from that user" >&2
  exit 1
fi

source_binary="${1:-}"
if [ -z "$source_binary" ] || [ ! -f "$source_binary" ]; then
  echo "usage: install-backup-sudoers.sh /path/to/indexer-backup-helper" >&2
  exit 1
fi

project_dir="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
helper_path="/usr/local/sbin/indexer-backup-sudo-helper"
binary_dir="/usr/local/lib/indexer"
binary_path="$binary_dir/indexer-backup-helper"
sudoers_path="/etc/sudoers.d/indexer-backup-helper"

mkdir -p "$binary_dir"
install -o root -g root -m 0755 "$source_binary" "$binary_path"

cat > "$helper_path" <<EOF_HELPER
#!/usr/bin/env sh
set -eu

if [ "\$#" -lt 1 ] || [ "\$#" -gt 2 ]; then
  echo "usage: indexer-backup-sudo-helper <backup/estimate|backup/run> [json-payload]" >&2
  exit 2
fi

action="\$1"
payload="\${2:-{}}"
case "\$action" in
  backup/estimate|backup/run) ;;
  *)
    echo "unsupported backup helper action: \$action" >&2
    exit 2
    ;;
esac

cd "$project_dir"
INDEXER_BACKUP_HELPER_CHILD=1 exec "$binary_path" backup-helper "\$action" "\$payload"
EOF_HELPER

chown root:root "$helper_path"
chmod 0755 "$helper_path"

tmp_sudoers="$(mktemp)"
printf '%s ALL=(root) NOPASSWD: %s\n' "$backup_user" "$binary_path" > "$tmp_sudoers"
chmod 0440 "$tmp_sudoers"
visudo -cf "$tmp_sudoers" >/dev/null
install -o root -g root -m 0440 "$tmp_sudoers" "$sudoers_path"
rm -f "$tmp_sudoers"

echo "installed $helper_path"
echo "installed $binary_path"
echo "installed $sudoers_path for user $backup_user"
