import IndexerApi from '../jsApi.GEN.js';

export async function refreshStatus(ctx) {
    const { getJSON, buildStatusView, applyStatusView, doc } = ctx
    try {
      const s = await getJSON(IndexerApi.status)
      const view = buildStatusView(s)
      applyStatusView(doc, view)
    } catch (err) {
      doc.getElementById('status').textContent = String(err)
    }
  }

export async function startReindex(ctx) {
    const { reindexUrl, selectedPriorityRoots, doc, getJSON, showToast, refreshStatus } = ctx
    try {
      const url = reindexUrl(selectedPriorityRoots(doc))
      const res = await getJSON(url, { method: 'POST' })
      if (res && res.message) showToast(res.message)
      refreshStatus()
    } catch (err) {
      showToast(String(err))
    }
  }

export function populatePriorityRoots(ctx) {
    const { doc, roots, buildPriorityRootOptions, escapeHtml } = ctx
    const select = doc.getElementById('priorityRoot')
    if (!select) return
    const view = buildPriorityRootOptions(
      roots,
      Array.from(select.selectedOptions || []).map(opt => opt.value),
      escapeHtml
    )
    select.innerHTML = view.html
    Array.from(select.options).forEach(opt => {
      if (view.selected.has(opt.value)) opt.selected = true
    })
  }

export function updateBrowseHistoryButtons(ctx) {
    const { doc, history, historyIndex, applyBrowseHistoryButtons, browseHistoryDisabled } = ctx
    applyBrowseHistoryButtons(doc, history, historyIndex, browseHistoryDisabled)
  }

export const IndexerIndexerPane = {
  refreshStatus,
  startReindex,
  populatePriorityRoots,
  updateBrowseHistoryButtons,
};
