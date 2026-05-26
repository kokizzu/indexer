export function applySortHeaders(doc, prefix, labels, state, sortHeaderText) {
    Object.entries(labels || {}).forEach(([field, label]) => {
      const el = doc.getElementById(prefix + field)
      if (!el) return
      el.textContent = sortHeaderText(label, state.sortBy === field, state.sortDesc)
    })
  }

export function applySearchTable(doc, searchState, buildSearchRows) {
    const tbody = doc.getElementById('searchTable')
    const filter = (doc.getElementById('searchFilter')?.value || '').trim().toLowerCase()
    const view = buildSearchRows(searchState, { filter })
    const rows = view.rows
    doc.getElementById('searchCount').textContent = rows.length + ' / ' + (searchState.total || rows.length) + ' rows'
    const totalPages = view.totalPages
    doc.getElementById('searchPageInfo').textContent = 'Page ' + (searchState.page + 1) + ' / ' + totalPages
    doc.getElementById('searchPageInfoTop').textContent = 'Page ' + (searchState.page + 1) + ' / ' + totalPages
    const prevDisabled = view.prevDisabled
    const nextDisabled = view.nextDisabled
    doc.getElementById('searchPrevTop').disabled = prevDisabled
    doc.getElementById('searchPrevBottom').disabled = prevDisabled
    doc.getElementById('searchNextTop').disabled = nextDisabled
    doc.getElementById('searchNextBottom').disabled = nextDisabled
    tbody.innerHTML = view.html
  }

export function buildPriorityRootOptions(roots, selectedValues, escapeHtml) {
    const current = new Set(selectedValues || [])
    const values = (roots || []).map(root => root.path).filter(Boolean)
    return {
      html: values.map(root => '<option value="' + escapeHtml(root) + '">' + escapeHtml(root) + '</option>').join(''),
      selected: current,
    }
  }

export function applyBrowseHistoryButtons(doc, history, historyIndex, browseHistoryDisabled) {
    const back = doc.getElementById('browseBackBtn')
    const forward = doc.getElementById('browseForwardBtn')
    const state = browseHistoryDisabled(history, historyIndex)
    if (back) back.disabled = state.backDisabled
    if (forward) forward.disabled = state.forwardDisabled
  }

export function renderTreeHtml(roots, renderTreeNode, state) {
    if (!(roots || []).length) {
      return '<div class="empty">No configured roots</div>'
    }
    return roots.map(root => renderTreeNode(root, 0, state)).join('')
  }

export function applyBrowseSelection(doc, path) {
    doc.getElementById('browseTitle').textContent = 'Directory Listing'
    doc.getElementById('browseSubtitle').textContent = path
  }

export function relativeTimeButtonText(enabled) {
    return 'Relative Time: ' + (enabled ? 'On' : 'Off')
  }

export function searchRelativeTimeTitle(enabled) {
    return 'Relative time: ' + (enabled ? 'On' : 'Off')
  }

export function applyBrowseTable(doc, browseState, buildBrowseRows) {
    const filter = (doc.getElementById('browseFilter')?.value || '').trim().toLowerCase()
    const tbody = doc.getElementById('browseTable')
    const view = buildBrowseRows(browseState, { filter })
    tbody.innerHTML = view.html
  }

export const IndexerSearchBrowseFlow = {
  applySortHeaders,
  applySearchTable,
  buildPriorityRootOptions,
  applyBrowseHistoryButtons,
  renderTreeHtml,
  applyBrowseSelection,
  relativeTimeButtonText,
  searchRelativeTimeTitle,
  applyBrowseTable,
};
