export function detectCategorySubdir(path) {
    const parts = String(path || '').split('/').filter(Boolean)
    for (const part of parts) {
      if (['_a', '_e', '_w', '_i'].includes(part)) return part
    }
    return ''
  }

export function isSortedReadyName(name) {
    return /\[[^\]]*of_w\d+\](?:=missing[\d,\-]+)?$/i.test(String(name || '').trim())
  }

export function buildSuggestedScanRow(item, res, mode) {
    const current = (res.current || item.base || '').trim()
    const suggested = (res.suggested || '').trim()
    const currentReady = isSortedReadyName(current)
    const suggestedReady = isSortedReadyName(suggested)
    let status = ''
    let statusLabel = ''
    if (currentReady) {
      status = 'move_ready'
      statusLabel = 'MOVE READY'
    } else if (suggested && suggested !== current) {
      status = suggestedReady ? 'rename_then_move' : 'rename'
      statusLabel = suggestedReady ? 'RENAME → MOVE' : 'RENAME'
    }
    if (mode === 'move') {
      if (!currentReady) return null
    } else {
      if (!status || currentReady) return null
    }
    return {
      path: item.path,
      base: item.base,
      fileCount: item.fileCount,
      dirCount: item.dirCount,
      current,
      suggested,
      newPath: res.newPath || '',
      suggestion: res.suggestion || {},
      status,
      statusLabel,
      currentReady,
      suggestedReady,
      isDir: true
    }
  }

export function buildDeleteScanRows(rows) {
    return (rows || []).map(item => ({
      path: item.path,
      base: item.base,
      fileCount: item.isDir ? (item.fileCount || 0) : 1,
      dirCount: item.isDir ? (item.dirCount || 0) : 0,
      current: item.base,
      suggested: item.path,
      newPath: '',
      status: item.isDir ? 'dir' : 'file',
      statusLabel: item.isDir ? 'DIR' : 'FILE',
      isDir: !!item.isDir
    }))
  }

export function toggleIndexSelection(current, idx, checked) {
    const next = new Set(current || [])
    if (checked) next.add(idx)
    else next.delete(idx)
    return Array.from(next).sort((a, b) => a - b)
  }

export function selectAllRowIndexes(rows, checked) {
    if (!checked) return []
    return (rows || []).map((_, idx) => idx)
  }

export function selectedRows(rows, selectedIndexes) {
    return (selectedIndexes || []).map(idx => (rows || [])[idx]).filter(Boolean)
  }

export const IndexerManageScan = {
  detectCategorySubdir,
  isSortedReadyName,
  buildSuggestedScanRow,
  buildDeleteScanRows,
  toggleIndexSelection,
  selectAllRowIndexes,
  selectedRows,
};
