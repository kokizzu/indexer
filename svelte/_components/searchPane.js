export async function runSearch(ctx) {
    const { doc, state, getJSON, currentSearchQuery, currentSearchKind, deriveSearchKind, searchRequestUrl, applySearchPage, renderSearchTable } = ctx
    const q = currentSearchQuery(doc)
    const kind = currentSearchKind(doc, deriveSearchKind)
    const page = await getJSON(searchRequestUrl(q, kind, state.pageSize, state.page))
    applySearchPage(state, page)
    renderSearchTable()
  }

export function resetSearchAndRun(ctx) {
    ctx.state.page = 0
    return ctx.runSearch()
  }

export function toggleRelativeTime(ctx) {
    const { doc, state, searchRelativeTimeTitle, renderSearchTable } = ctx
    state.relativeTime = !state.relativeTime
    const el = doc.getElementById('toggleSearchRelativeTime')
    if (el) el.title = searchRelativeTimeTitle(state.relativeTime)
    renderSearchTable()
  }

export function setSearchSort(ctx) {
    const { field, state, nextSortState, updateSearchSortHeaders, renderSearchTable } = ctx
    Object.assign(state, nextSortState(state, field))
    updateSearchSortHeaders()
    renderSearchTable()
  }

export function updateSearchSortHeaders(ctx) {
    const { doc, state, applySortHeaders, sortHeaderText } = ctx
    applySortHeaders(doc, 'searchSort-', {
      isDir: 'Type',
      base: 'Name',
      root: 'Root',
      contents: 'Contents',
      size: 'Size',
      modifiedAt: 'Modified'
    }, state, sortHeaderText)
  }

export function renderSearchTable(ctx) {
    const { doc, state, applySearchTable, buildSearchRows } = ctx
    applySearchTable(doc, state, buildSearchRows)
  }

export function changeSearchPage(ctx) {
    const { delta, state, nextSearchPage, runSearch } = ctx
    const next = nextSearchPage(state.total, state.pageSize, state.page, delta)
    if (!next.changed) return
    state.page = next.page
    runSearch()
  }

export function normalizeSearchKinds(ctx) {
    const { doc, changed, normalizeSearchKindsState } = ctx
    const dir = doc.getElementById('searchDirOnly')
    const file = doc.getElementById('searchFileOnly')
    const next = normalizeSearchKindsState(dir.checked, file.checked, changed)
    dir.checked = next.dirChecked
    file.checked = next.fileChecked
  }

export function onSearchKey(ctx) {
    const { event, resetSearchAndRun } = ctx
    if (event.key !== 'Enter') return
    event.preventDefault()
    resetSearchAndRun()
  }

export const IndexerSearchPane = {
  runSearch,
  resetSearchAndRun,
  toggleRelativeTime,
  setSearchSort,
  updateSearchSortHeaders,
  renderSearchTable,
  changeSearchPage,
  normalizeSearchKinds,
  onSearchKey,
};
