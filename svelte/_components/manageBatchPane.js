import IndexerApi from '../jsApi.GEN.js';

export function isRowSelected(ctx) {
    const { state, idx } = ctx
    return (state.selectedScanRows || []).includes(idx)
  }

export function toggleRowSelection(ctx) {
    const { state, idx, checked, toggleIndexSelection, renderManageBatchActions } = ctx
    state.selectedScanRows = toggleIndexSelection(state.selectedScanRows, idx, checked)
    renderManageBatchActions()
  }

export function toggleSelectAll(ctx) {
    const { state, checked, selectAllRowIndexes, renderManageBatchActions } = ctx
    state.selectedScanRows = selectAllRowIndexes(state.scanRows, checked)
    renderManageBatchActions()
  }

export function selectedRowsForBatch(ctx) {
    const { state, selectedRows } = ctx
    return selectedRows(state.scanRows, state.selectedScanRows)
  }

export async function queueSelectedCategorize(ctx) {
    const {
      state, categorizeOptionsFromUI, queueBatchWithPassword, promptFn, getJSON, batchQueueActions,
      doc, refreshManageQueue, refreshManageHistory, showToast, selectedManageRows,
    } = ctx
    const opts = categorizeOptionsFromUI()
    try {
      const res = await queueBatchWithPassword({
        rows: selectedManageRows(),
        promptFn,
        promptText: 'Manage password?',
        missingRowsMessage: 'No scan rows selected',
        missingPasswordMessage: 'Password is required to queue batch categorize',
        getJSON,
        batchQueueActions,
        requestBuilder: (item, password) => ({
          action: 'categorize',
          password,
          srcPath: item.path,
          videosOnly: opts.videosOnly,
          watchedCount: opts.watchedCount,
          removeEmptyDirs: opts.removeEmptyDirs
        }),
        doc,
        successMessage: 'Batch categorize queued: ',
        partialMessage: 'Batch categorize queued with errors',
        after: async () => { await refreshManageQueue(); await refreshManageHistory() },
      })
      showToast(res.toast)
    } catch (err) {
      showToast(err.message || String(err))
    }
  }

export async function queueSelectedRenames(ctx) {
    const {
      queueBatchWithPassword, promptFn, getJSON, batchQueueActions, doc,
      refreshManageQueue, refreshManageHistory, showToast, selectedManageRows,
    } = ctx
    try {
      const res = await queueBatchWithPassword({
        rows: selectedManageRows(),
        promptFn,
        promptText: 'Manage password?',
        missingRowsMessage: 'No scan rows selected',
        missingPasswordMessage: 'Password is required to queue batch rename',
        getJSON,
        batchQueueActions,
        requestBuilder: (item, password) => ({
          action: 'rename',
          password,
          srcPath: item.path,
          newPath: item.newPath
        }),
        doc,
        successMessage: 'Batch rename queued: ',
        partialMessage: 'Batch rename queued with errors',
        after: async () => { await refreshManageQueue(); await refreshManageHistory() },
      })
      showToast(res.toast)
    } catch (err) {
      showToast(err.message || String(err))
    }
  }

export async function queueSelectedMoves(ctx) {
    const {
      formState, queueBatchWithPassword, promptFn, getJSON, batchQueueActions,
      refreshManageQueue, refreshManageHistory, showToast, selectedManageRows,
    } = ctx
    const dstRoot = String(formState.dstRoot || '').trim()
    const dstSubdir = String(formState.dstSubdir || '').trim().replace(/^\/+/, '').replace(/\/+$/, '')
    const dstDir = dstSubdir ? (dstRoot.replace(/\/+$/, '') + '/' + dstSubdir) : dstRoot
    if (!dstRoot) {
      showToast('Destination root is required')
      return
    }
    try {
      const res = await queueBatchWithPassword({
        rows: selectedManageRows(),
        promptFn,
        promptText: 'Manage password?',
        missingRowsMessage: 'No scan rows selected',
        missingPasswordMessage: 'Password is required to queue batch move',
        getJSON,
        batchQueueActions,
        requestBuilder: (item, password) => ({
          action: 'move',
          password,
          srcPath: item.path,
          dstDir
        }),
        doc,
        successMessage: 'Batch move queued: ',
        partialMessage: 'Batch move queued with errors',
        resultBuilder: ({ queued, errors }) => ({ queued, dstDir, errors }),
        after: async () => { await refreshManageQueue(); await refreshManageHistory() },
      })
      showToast(res.toast)
    } catch (err) {
      showToast(err.message || String(err))
    }
  }

export async function queueSelectedDeletes(ctx) {
    const {
      queueBatchWithPassword, promptFn, getJSON, batchQueueActions, doc,
      refreshManageQueue, refreshManageHistory, showToast, selectedManageRows,
    } = ctx
    try {
      const res = await queueBatchWithPassword({
        rows: selectedManageRows(),
        promptFn,
        promptText: 'Manage password?',
        missingRowsMessage: 'No scan rows selected',
        missingPasswordMessage: 'Password is required to queue batch delete',
        getJSON,
        batchQueueActions,
        requestBuilder: (item, password) => ({
          action: 'delete',
          password,
          srcPath: item.path
        }),
        doc,
        successMessage: 'Batch delete queued: ',
        partialMessage: 'Batch delete queued with errors',
        after: async () => { await refreshManageQueue(); await refreshManageHistory() },
      })
      showToast(res.toast)
    } catch (err) {
      showToast(err.message || String(err))
    }
  }

export async function queueSubtitleRename(ctx) {
    const {
      index, event, state, queueSingleWithPassword, promptFn, getJSON, postJSON, doc,
      renderSubtitleCandidates, refreshManageQueue, refreshManageHistory, showToast,
    } = ctx
    if (event) event.stopPropagation()
    const item = (state.subtitleRows || [])[index]
    try {
      await queueSingleWithPassword({
        item,
        promptFn,
        promptText: 'Manage password?',
        missingItemMessage: 'Subtitle row not found',
        missingPasswordMessage: 'Password is required to queue this action',
        getJSON,
        postJSON,
        url: IndexerApi.manageQueue,
        bodyBuilder: (row, password) => ({
          action: 'rename',
          password,
          srcPath: row.path,
          newPath: row.newPath
        }),
        doc,
        after: async () => {
          state.subtitleRows.splice(index, 1)
          renderSubtitleCandidates()
          await refreshManageQueue()
          await refreshManageHistory()
        },
      })
      showToast('Subtitle rename queued')
    } catch (err) {
      showToast(err.message || String(err))
    }
  }

export const IndexerManageBatchPane = {
  isRowSelected,
  toggleRowSelection,
  toggleSelectAll,
  selectedRowsForBatch,
  queueSelectedCategorize,
  queueSelectedRenames,
  queueSelectedMoves,
  queueSelectedDeletes,
  queueSubtitleRename,
};
