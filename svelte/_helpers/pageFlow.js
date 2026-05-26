import IndexerApi from '../jsApi.GEN.js';

export function applyTabState() {}

export function selectedPriorityRoots(doc) {
    return Array.from(doc.getElementById('priorityRoot')?.selectedOptions || []).map(opt => opt.value)
  }

export function reindexUrl(priorityRoots) {
    const priority = (priorityRoots || []).join(',')
    return priority ? IndexerApi.reindex + '?priority=' + encodeURIComponent(priority) : IndexerApi.reindex
  }

export function applyStatusView(doc, view) {
    doc.getElementById('progressFill').style.width = view.pct.toFixed(2) + '%'
    doc.getElementById('metricWorkers').textContent = view.workersText
    doc.getElementById('metricTotalSize').innerHTML = view.totalSizeHtml
    doc.getElementById('metricKinds').textContent = view.kindsText
    doc.getElementById('metricRoots').textContent = view.rootsText
    doc.getElementById('progressMeta').textContent = view.progressMeta
    doc.getElementById('status').textContent = view.statusJson
    doc.getElementById('treeProgress').innerHTML = view.treeHtml
  }

export function searchRequestUrl(query, kind, pageSize, page) {
    const q = String(query || '').trim()
    const offset = Number(page || 0) * Number(pageSize || 0)
    return IndexerApi.search + '?q=' + encodeURIComponent(q) +
      '&kind=' + encodeURIComponent(kind || '') +
      '&limit=' + encodeURIComponent(pageSize || 0) +
      '&offset=' + encodeURIComponent(offset)
  }

export function currentSearchQuery(doc) {
    return doc.getElementById('searchQuery')?.value.trim() || ''
  }

export function currentSearchKind(doc, deriveSearchKind) {
    return deriveSearchKind(
      Boolean(doc.getElementById('searchDirOnly')?.checked),
      Boolean(doc.getElementById('searchFileOnly')?.checked)
    )
  }

export function applySearchPage(searchState, page) {
    searchState.rows = page.rows || []
    searchState.total = page.total || 0
    return searchState
  }

export const IndexerPageFlow = {
  applyTabState,
  selectedPriorityRoots,
  reindexUrl,
  applyStatusView,
  searchRequestUrl,
  currentSearchQuery,
  currentSearchKind,
  applySearchPage,
};
