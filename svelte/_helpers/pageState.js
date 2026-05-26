export function nextSortState(state, field) {
    const next = { ...state }
    if (next.sortBy === field) {
      next.sortDesc = !next.sortDesc
    } else {
      next.sortBy = field
      next.sortDesc = false
    }
    return next
  }

export function nextSearchPage(total, pageSize, currentPage, delta) {
    const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize))
    const next = currentPage + delta
    if (next < 0 || next >= totalPages) {
      return { changed: false, page: currentPage, totalPages }
    }
    return { changed: true, page: next, totalPages }
  }

export function currentSearchKind(dirChecked, fileChecked) {
    if (dirChecked && fileChecked) return ''
    if (fileChecked) return 'file'
    return 'dir'
  }

export function normalizeSearchKinds(dirChecked, fileChecked, changed) {
    if (dirChecked || fileChecked) {
      return { dirChecked, fileChecked }
    }
    if (changed === 'file') {
      return { dirChecked: true, fileChecked: false }
    }
    return { dirChecked: false, fileChecked: true }
  }

export function nextBrowseHistory(history, historyIndex, path, pushHistory) {
    if (pushHistory === false) {
      return { history, historyIndex, selectedPath: path }
    }
    let nextHistory = history || []
    let nextIndex = historyIndex
    if (nextIndex < nextHistory.length - 1) {
      nextHistory = nextHistory.slice(0, nextIndex + 1)
    }
    if (nextHistory[nextHistory.length - 1] !== path) {
      nextHistory = [...nextHistory, path]
      nextIndex = nextHistory.length - 1
    }
    return { history: nextHistory, historyIndex: nextIndex, selectedPath: path }
  }

export function browseHistoryDisabled(history, historyIndex) {
    return {
      backDisabled: historyIndex <= 0,
      forwardDisabled: historyIndex < 0 || historyIndex >= (history || []).length - 1
    }
  }

export function parentDir(path) {
    const clean = String(path || '').trim().replace(/\/+$/, '')
    if (!clean) return ''
    const idx = clean.lastIndexOf('/')
    if (idx <= 0) return clean
    return clean.slice(0, idx)
  }

export function browseTarget(path, isDir) {
    return Number(isDir) === 1 ? path : parentDir(path)
  }

export const IndexerPageState = {
  nextSortState,
  nextSearchPage,
  currentSearchKind,
  normalizeSearchKinds,
  nextBrowseHistory,
  browseHistoryDisabled,
  parentDir,
  browseTarget,
};
