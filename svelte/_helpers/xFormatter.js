export function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function valueOrDash(value) {
  return value ? escapeHtml(value) : '<span style="color:var(--muted)">-</span>';
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx++;
  }
  return value.toFixed(idx === 0 ? 0 : 2) + ' ' + units[idx];
}

export function formatBytesHtml(bytes) {
  if (!bytes) return '<span class="unit-b">0 B</span>';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const classes = ['unit-b', 'unit-kb', 'unit-mb', 'unit-gb', 'unit-tb'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx++;
  }
  return '<span class="' + classes[idx] + '">' + value.toFixed(idx === 0 ? 0 : 2) + ' ' + units[idx] + '</span>';
}

export function formatAgeByMode(iso, useRelative) {
  if (!useRelative || !iso) return escapeHtml(iso || '');
  const then = new Date(iso);
  const now = new Date();
  const diffMs = now - then;
  const dayMs = 24 * 60 * 60 * 1000;
  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const mins = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    return '<span class="ageDay">' + String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0') + '</span>';
  }
  const days = diffMs / dayMs;
  if (days >= 365) {
    return '<span class="ageYear">' + (days / 365).toFixed(2) + ' Y</span>';
  }
  return '<span class="ageDay">' + Math.floor(days) + ' D</span>';
}
