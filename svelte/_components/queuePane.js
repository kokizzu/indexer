import IndexerApi from '../jsApi.GEN.js';

export async function refreshQueue(ctx) {
    const { getJSON, state, applyManageQueueState, doc, renderManageQueueHtml, isManageQueueSelected, renderManageTaskCard } = ctx
    const res = await getJSON(IndexerApi.manageStatus)
    const { runningTasks, queued } = applyManageQueueState(state, res)
    doc.getElementById('manageQueueBox').innerHTML = renderManageQueueHtml(runningTasks, queued, isManageQueueSelected, renderManageTaskCard)
  }

export async function refreshHistory(ctx) {
    const { getJSON, state, applyManageHistoryState, doc, applyManageHistoryHtml, buildManageHistoryRows, renderManageTaskMeta, renderManageMessage } = ctx
    const rows = await getJSON(IndexerApi.manageHistory + '?limit=100')
    applyManageHistoryState(state, rows)
    applyManageHistoryHtml(doc, rows, state.selectedHistoryRows || [], buildManageHistoryRows, renderManageTaskMeta, renderManageMessage)
  }

export function isSelected(ctx) {
    const { state, key, id, idSelected, hasSelection } = ctx
    return idSelected(state, key, id, hasSelection)
  }

export function isQueueRowSelected(ctx) {
    const { state, id, idSelected, hasSelection } = ctx
    return idSelected(state, 'selectedQueueRows', id, hasSelection)
  }

export function isHistoryRowSelected(ctx) {
    const { state, id, idSelected, hasSelection } = ctx
    return idSelected(state, 'selectedHistoryRows', id, hasSelection)
  }

export function toggleSelected(ctx) {
    const { state, key, id, checked, toggleIdSelection, toggleSelection } = ctx
    toggleIdSelection(state, key, id, checked, toggleSelection)
  }

export function toggleQueueRowSelected(ctx) {
    const { state, id, checked, toggleIdSelection, toggleSelection } = ctx
    toggleIdSelection(state, 'selectedQueueRows', id, checked, toggleSelection)
  }

export function toggleHistoryRowSelected(ctx) {
    const { state, id, checked, toggleIdSelection, toggleSelection } = ctx
    toggleIdSelection(state, 'selectedHistoryRows', id, checked, toggleSelection)
  }

export async function cancelTask(ctx) {
    const { id, showToast, postJSON, getJSON, setManageResult, doc, refreshManageQueue, refreshManageHistory } = ctx
    if (!id) {
      showToast('Task id is required')
      return
    }
    const res = await postJSON(getJSON, IndexerApi.manageCancel, { id })
    setManageResult(doc, res)
    showToast('Queued task cancelled')
    refreshManageQueue()
    refreshManageHistory()
  }

export async function cancelSelected(ctx) {
    const { state, showToast, batchQueueActions, getJSON, setManageResult, doc, refreshManageQueue, refreshManageHistory } = ctx
    const ids = [...(state.selectedQueueRows || [])]
    if (!ids.length) {
      showToast('No queued tasks selected')
      return
    }
    const { queued: cancelled, errors } = await batchQueueActions(getJSON, ids, id => ({ id }))
    state.selectedQueueRows = []
    setManageResult(doc, { cancelled, errors })
    if (errors.length) showToast('Batch cancel finished with errors')
    else showToast('Batch cancel: ' + cancelled)
    refreshManageQueue()
    refreshManageHistory()
  }

export async function retryHistoryTask(ctx) {
    const { id, promptFn, showToast, postJSON, getJSON, setManageResult, doc, refreshManageQueue, refreshManageHistory } = ctx
    if (!id) {
      showToast('History id is required')
      return
    }
    const password = promptFn('Manage password?') || ''
    if (!password) {
      showToast('Password is required to retry this action')
      return
    }
    const res = await postJSON(getJSON, IndexerApi.manageRetry, { id, password })
    setManageResult(doc, res)
    showToast('Manage action retried')
    refreshManageQueue()
    refreshManageHistory()
  }

export async function retrySelected(ctx) {
    const { state, promptFn, showToast, batchQueueActions, getJSON, setManageResult, doc, refreshManageQueue, refreshManageHistory } = ctx
    const ids = [...(state.selectedHistoryRows || [])]
    if (!ids.length) {
      showToast('No history rows selected')
      return
    }
    const password = promptFn('Manage password?') || ''
    if (!password) {
      showToast('Password is required to retry these actions')
      return
    }
    const { queued, errors } = await batchQueueActions(getJSON, ids, id => ({ id, password }))
    state.selectedHistoryRows = []
    setManageResult(doc, { queued, errors })
    if (errors.length) showToast('Batch retry finished with errors')
    else showToast('Batch retry: ' + queued)
    refreshManageQueue()
    refreshManageHistory()
  }

export const IndexerQueuePane = {
  refreshQueue,
  refreshHistory,
  isSelected,
  isQueueRowSelected,
  isHistoryRowSelected,
  toggleSelected,
  toggleQueueRowSelected,
  toggleHistoryRowSelected,
  cancelTask,
  cancelSelected,
  retryHistoryTask,
  retrySelected,
};
