import { escapeHtml, formatBytesHtml, formatAgeByMode } from './xFormatter.js';

export function sortHeaderText(label, isActive, isDesc) {
    return label + (isActive ? (isDesc ? ' ↓' : ' ↑') : '')
  }

  function fdCountsHtml(item) {
    if (item.isDir) {
      return '<span class="fdFile tooltipish" title="descendant files">' + (item.fileCount || 0) + ' F</span> <span class="fdDir tooltipish" title="descendant directories">' + (item.dirCount || 0) + ' D</span>'
    }
    return '<span class="fdFile">1 F</span>'
  }

  function compareByField(a, b, sortBy, sortDesc, rootAccessor) {
    let av
    let bv
    switch (sortBy) {
      case 'base':
        av = a.base || ''
        bv = b.base || ''
        break
      case 'root':
        av = rootAccessor ? rootAccessor(a) : ''
        bv = rootAccessor ? rootAccessor(b) : ''
        break
      case 'contents':
        av = (a.fileCount || 0) + (a.dirCount || 0)
        bv = (b.fileCount || 0) + (b.dirCount || 0)
        break
      case 'size':
        av = a.size || 0
        bv = b.size || 0
        break
      case 'isDir':
        av = a.isDir ? 1 : 0
        bv = b.isDir ? 1 : 0
        break
      case 'modifiedAt':
      default:
        av = a.modifiedAt || ''
        bv = b.modifiedAt || ''
        break
    }
    if (av < bv) return sortDesc ? 1 : -1
    if (av > bv) return sortDesc ? -1 : 1
    return String(a.base || '').localeCompare(String(b.base || ''))
  }

export function buildSearchRows(state, options) {
    const rows = [...(state.rows || [])].filter(item => {
      if (!options.filter) return true
      return String(item.base || '').toLowerCase().includes(options.filter) ||
        String(item.path || '').toLowerCase().includes(options.filter) ||
        String(item.root || '').toLowerCase().includes(options.filter)
    })
    rows.sort((a, b) => compareByField(a, b, state.sortBy, state.sortDesc, item => (item.rootKind || '') + '/' + (item.root || '')))
    const totalPages = Math.max(1, Math.ceil((state.total || rows.length || 1) / state.pageSize))
    const html = !rows.length
      ? '<tr><td colspan="6" class="empty">No results</td></tr>'
      : rows.map(item =>
        '<tr>' +
          '<td><span class="pill ' + (item.isDir ? 'pillDir' : 'pillFile') + '">' + (item.isDir ? 'DIR' : 'FILE') + '</span></td>' +
          '<td><div class="nameCell"><span class="nameLabel cellEllipsis" title="' + escapeHtml(item.path || '') + '">' + escapeHtml(item.base) + '</span><span class="rowActions"><button class="ghost iconBtn" title="Show in Browse" onclick="showInBrowseEncoded(\'' + encodeURIComponent(item.path || '') + '\',' + (item.isDir ? 1 : 0) + ', event)">↗</button><button class="ghost iconBtn" title="' + escapeHtml(item.path || '') + '" onclick="copyPathEncoded(\'' + encodeURIComponent(item.path || '') + '\', event)">⧉</button></span></div></td>' +
          '<td>' + escapeHtml(item.rootKind || '') + ' / ' + escapeHtml(item.root || '') + '</td>' +
          '<td><span class="cellEllipsis">' + fdCountsHtml(item) + '</span></td>' +
          '<td>' + formatBytesHtml(item.size || 0) + '</td>' +
          '<td class="mono">' + formatAgeByMode(item.modifiedAt || '', state.relativeTime) + '</td>' +
        '</tr>'
      ).join('')
    return {
      rows,
      totalPages,
      prevDisabled: state.page <= 0,
      nextDisabled: state.page >= totalPages - 1,
      html
    }
  }

export function buildBrowseRows(state, options) {
    const filtered = [...(state.currentRows || [])]
      .filter(item => !options.filter || String(item.base || '').toLowerCase().includes(options.filter))
    filtered.sort((a, b) => compareByField(a, b, state.sortBy, state.sortDesc))
    const html = !filtered.length
      ? '<tr><td colspan="5" class="empty">Empty directory</td></tr>'
      : filtered.map(item => {
        const encodedPath = encodeURIComponent(item.path || '')
        return '<tr' + (item.isDir ? ' ondblclick="openBrowsePath(\'' + encodedPath + '\')"' : '') + '>' +
          '<td><div class="nameCell"><span class="nameLabel cellEllipsis" title="' + escapeHtml(item.path || '') + '">' + escapeHtml(item.base) + '</span><span class="rowActions">' +
            (item.isDir ? '<button class="ghost iconBtn" title="Open directory" onclick="openBrowsePath(\'' + encodedPath + '\')">↗</button>' : '') +
            '<button class="ghost iconBtn" title="' + escapeHtml(item.path || '') + '" onclick="copyPathEncoded(\'' + encodedPath + '\', event)">⧉</button>' +
          '</span></div></td>' +
          '<td><span class="pill ' + (item.isDir ? 'pillDir' : 'pillFile') + '">' + (item.isDir ? 'DIR' : 'FILE') + '</span></td>' +
          '<td><span class="cellEllipsis">' + fdCountsHtml(item) + '</span></td>' +
          '<td>' + formatBytesHtml(item.size || 0) + '</td>' +
          '<td class="mono">' + formatAgeByMode(item.modifiedAt || '', state.relativeTime) + '</td>' +
        '</tr>'
      }).join('')
    return { rows: filtered, html }
  }

export function renderTreeNode(item, depth, state) {
    const path = item.path
    const expanded = state.expanded.has(path)
    const children = state.loaded.get(path) || []
    const active = state.selectedPath === path
    const maxRootBytes = (state.roots || []).reduce((mx, root) => Math.max(mx, Number(root.size || 0)), 0)
    const rootPct = depth === 0 && maxRootBytes > 0 ? ((Number(item.size || 0) / maxRootBytes) * 100) : 0
    return (
      '<div class="treeNode">' +
        '<div class="treeRow' + (active ? ' active' : '') + '" onclick="selectNode(\'' + encodeURIComponent(path) + '\')">' +
          '<span class="treeIndent" style="width:' + (depth * 14) + 'px"></span>' +
          '<span class="twisty" onclick="event.stopPropagation(); toggleNode(\'' + encodeURIComponent(path) + '\')">' + (expanded ? '▾' : '▸') + '</span>' +
          '<span class="treeName">' + escapeHtml(item.base) + '</span>' +
          '<span class="treeMeta">' + (item.isDir ? (fdCountsHtml(item) + ' • ') : '') + formatBytesHtml(item.size || 0) + '</span>' +
        '</div>' +
        (depth === 0 ? '<div class="progressBar" style="margin:4px 0 6px 28px; height:8px"><div class="progressFill" style="width:' + rootPct.toFixed(2) + '%"></div></div>' : '') +
        (expanded ? '<div class="children">' + children.map(child => renderTreeNode(child, depth + 1, state)).join('') + '</div>' : '') +
      '</div>'
    )
  }

export const IndexerBrowseSearch = {
  sortHeaderText,
  buildSearchRows,
  buildBrowseRows,
  renderTreeNode,
};
