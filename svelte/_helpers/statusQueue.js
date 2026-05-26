import { escapeHtml, formatBytes, formatBytesHtml } from './xFormatter.js';

  export function buildStatusView(status) {
    const s = status || {}
    const allRoots = (s.mounts || []).flatMap(m => m.roots || [])
    const pct = allRoots.length
      ? allRoots.reduce((acc, root) => acc + Number(root.progressPct || 0), 0) / allRoots.length
      : Number(s.progressPct || 0)
    const progressMeta =
      'resumed=' + Boolean(s.resumed) +
      '  workers=' + (s.activeWorkers || 0) + '/' + (s.workerCount || 0) +
      '  roots=' + (s.estimatedRoots || 0) + '/' + (s.totalRoots || 0) +
      '\nestimated=' + formatBytes(s.totalBytes || 0) +
      '  processed=' + formatBytes(s.processedBytes || 0) +
      '  indexed=' + (s.indexed || 0) +
      '  files=' + (s.files || 0) +
      '  dirs=' + (s.directories || 0) +
      '\ncurrent=' + (s.currentPath || '')
    const treeHtml = (s.mounts || []).map(mount =>
      '<div class="mountCard">' +
        '<div><strong>' + escapeHtml(mount.mountPoint || '(unknown)') + '</strong> <span class="mono">' + Number(mount.progressPct || 0).toFixed(2) + '%</span></div>' +
        '<div class="progressBar" style="margin:6px 0 8px"><div class="progressFill" style="width:' + Number(mount.progressPct || 0).toFixed(2) + '%"></div></div>' +
        (mount.roots || []).map(root =>
          '<div class="rootCard">' +
            '<div><span class="pill">' + escapeHtml(root.kind) + '</span>' + escapeHtml(root.path) + '</div>' +
            '<div class="mono" style="color:var(--muted); margin-top:3px">' + formatBytesHtml(root.processedBytes || 0) + ' / ' + formatBytesHtml(root.totalBytes || 0) + '</div>' +
            '<div class="progressBar" style="margin-top:4px"><div class="progressFill" style="width:' + Number(root.progressPct || 0).toFixed(2) + '%"></div></div>' +
          '</div>'
        ).join('') +
      '</div>'
    ).join('')
    return {
      pct,
      workersText: (s.activeWorkers || 0) + ' / ' + (s.workerCount || 0),
      totalSizeHtml: formatBytesHtml(s.totalBytes || 0),
      kindsText: (s.files || 0) + ' / ' + (s.directories || 0),
      rootsText: (s.estimatedRoots || 0) + ' / ' + (s.totalRoots || 0),
      progressMeta,
      statusJson: JSON.stringify(s, null, 2),
      treeHtml,
    }
  }

  export function buildManageHistoryRows(rows, selectedHistoryRows, renderMeta, renderMessage) {
    if (!rows.length) {
      return '<tr><td colspan="5" class="empty">No history yet</td></tr>'
    }
    const selected = new Set(selectedHistoryRows || [])
    return rows.map(item =>
      '<tr>' +
        '<td><div class="row" style="margin:0"><input type="checkbox" ' + (selected.has(item.id) ? 'checked ' : '') + 'onchange="toggleManageHistorySelection(\'' + escapeHtml(item.id || '') + '\', this.checked)"><span>' + escapeHtml(item.action || '') + '</span></div></td>' +
        '<td>' + escapeHtml(item.status || '') + '</td>' +
        '<td><span class="cellEllipsis mono" title="' + escapeHtml(item.srcPath || '') + '">' + escapeHtml(item.srcPath || '') + '</span></td>' +
        '<td><span class="cellEllipsis mono" title="' + escapeHtml(item.dstPath || '') + '">' + escapeHtml(item.dstPath || '') + '</span></td>' +
        '<td><div class="mono">' + escapeHtml(item.finishedAt || '') + '</div>' + renderMeta(item) + '<div class="row" style="margin:6px 0 0 0"><button class="ghost" onclick="retryManageHistoryTask(\'' + escapeHtml(item.id || '') + '\')">Retry</button></div>' + (item.message ? '<div style="margin-top:4px">' + renderMessage(item.message) + '</div>' : '') + '</td>' +
      '</tr>'
    ).join('')
  }

export const IndexerStatusQueue = {
  buildStatusView,
  buildManageHistoryRows,
};
