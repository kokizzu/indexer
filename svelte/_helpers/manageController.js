export function markManualInput(input) {
    if (input) input.dataset.manual = '1'
  }

export function applyManagePreview(doc, html) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
      detail: {
        kind: 'preview',
        previewHtml: html,
      }
    }))
  }

export function applyManageModal(doc, plan, bodyHtml) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:manageModal', {
      detail: {
        open: true,
        title: plan.title,
        subtitle: plan.subtitle,
        bodyHtml,
      }
    }))
  }

export function closeManageModal(doc, event) {
    if (event && event.target && event.target !== doc.getElementById('manageModal')) return false
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:manageModal', { detail: { open: false } }))
    return true
  }

export function queueBodyFromPlan(plan, password) {
    return {
      action: plan.action,
      password,
      srcPath: plan.body.oldPath || plan.body.srcPath || plan.body.path || '',
      dstDir: plan.body.dstDir || '',
      newPath: plan.body.newPath || ''
    }
  }

export function applyManageQueueState(state, res) {
    const runningTasks = (res.runningTasks && res.runningTasks.length ? res.runningTasks : (res.running && res.running.id ? [res.running] : [])) || []
    const queued = res.queued || []
    state.queueRows = queued
    state.selectedQueueRows = (state.selectedQueueRows || []).filter(id => queued.some(item => item && item.id === id))
    return { runningTasks, queued }
  }

export function renderManageQueueHtml(runningTasks, queued, isSelected, renderManageTaskCard) {
    let html = ''
    if (runningTasks.length) {
      html += runningTasks.map(running => renderManageTaskCard('Running', running, false)).join('')
    }
    if (queued.length) {
      html += queued.map(item => renderManageTaskCard('Queued', item, isSelected(item.id))).join('')
    }
    return html || 'No queued actions.'
  }

export function applyManageHistoryState(state, rows) {
    state.historyRows = rows || []
    state.selectedHistoryRows = (state.selectedHistoryRows || []).filter(id => (rows || []).some(item => item && item.id === id))
    return state.historyRows
  }

export function applyManageHistoryHtml(doc, rows, selectedHistoryRows, buildManageHistoryRows, renderManageTaskMeta, renderManageMessage) {
    const tbody = doc.getElementById('manageHistoryTable')
    tbody.innerHTML = buildManageHistoryRows(rows || [], selectedHistoryRows || [], renderManageTaskMeta, renderManageMessage)
  }

export function toggleCategorizeSortState(state, which, field) {
    const sortByKey = which === 'groups' ? 'categorizeGroupSortBy' : (which === 'ops' ? 'categorizeOpSortBy' : 'categorizeAmbiguousSortBy')
    const sortDescKey = which === 'groups' ? 'categorizeGroupSortDesc' : (which === 'ops' ? 'categorizeOpSortDesc' : 'categorizeAmbiguousSortDesc')
    if (state[sortByKey] === field) {
      state[sortDescKey] = !state[sortDescKey]
    } else {
      state[sortByKey] = field
      state[sortDescKey] = false
    }
    return state
  }

export const IndexerManageController = {
  markManualInput,
  applyManagePreview,
  applyManageModal,
  closeManageModal,
  queueBodyFromPlan,
  applyManageQueueState,
  renderManageQueueHtml,
  applyManageHistoryState,
  applyManageHistoryHtml,
  toggleCategorizeSortState,
};
