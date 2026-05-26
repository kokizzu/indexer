export function switchTab(ctx) {
    const { tab, applyTabState, doc, storage, syncManageDefaults, refreshManageQueue, refreshManageHistory } = ctx
    applyTabState(doc, tab)
    try { storage.setItem('indexer.activeTab', tab) } catch (_) {}
    try { window.dispatchEvent(new CustomEvent('indexer:tab', { detail: { tab } })) } catch (_) {}
    if (tab === 'manage') syncManageDefaults()
    if (tab === 'queue') {
      refreshManageQueue()
      refreshManageHistory()
    }
  }

export function setSearchSort(ctx) {
    const { field, state, nextSortState, updateSearchSortHeaders, renderSearchTable } = ctx
    Object.assign(state, nextSortState(state, field))
    updateSearchSortHeaders()
    renderSearchTable()
  }

export function setBrowseSort(ctx) {
    const { field, state, nextSortState, updateBrowseSortHeaders, renderBrowseTable } = ctx
    Object.assign(state, nextSortState(state, field))
    updateBrowseSortHeaders()
    renderBrowseTable()
  }

export function toggleBrowseRelativeTime(ctx) {
    const { state, doc, relativeTimeButtonText, renderBrowseTable } = ctx
    state.relativeTime = !state.relativeTime
    doc.getElementById('toggleRelativeTime').textContent = relativeTimeButtonText(state.relativeTime)
    renderBrowseTable()
  }

export function prefillManageFromBrowse(ctx) {
    const { browseState, kind, showToast, prefillManageFromPath } = ctx
    if (!browseState.selectedPath) {
      showToast('No browse path selected')
      return
    }
    prefillManageFromPath(kind, browseState.selectedPath)
  }

export function setManageSelectedSourceFromBrowse(ctx) {
    const { browseState, state, showToast, renderManageSelectedSource, syncManageRenamePath, populateManageCategorySubdir } = ctx
    if (!browseState.selectedPath) {
      showToast('No browse path selected')
      return
    }
    state.selectedSource = browseState.selectedPath
    renderManageSelectedSource()
    syncManageRenamePath()
    populateManageCategorySubdir(state.selectedSource)
  }

export function useScannedDirectory(ctx) {
    const { index, state, requireScanRow, showToast, prefillManageFromPath } = ctx
    let item
    try {
      item = requireScanRow(state.scanRows, index, 'Scanned directory not found')
    } catch (err) {
      showToast(String(err.message || err))
      return
    }
    prefillManageFromPath(state.tab, item.path)
  }

export function previewScannedCategorize(ctx) {
    const { index, state, requireScanRow, showToast, renderManageSelectedSource, switchManageTab, previewCategorize } = ctx
    let item
    try {
      item = requireScanRow(state.scanRows, index, 'Scanned directory not found')
    } catch (err) {
      showToast(String(err.message || err))
      return
    }
    state.selectedSource = item.path
    renderManageSelectedSource()
    switchManageTab('suggest')
    previewCategorize()
  }

export function previewScannedMove(ctx) {
    const { index, prepareScannedMove, previewManage } = ctx
    prepareScannedMove(index)
    previewManage('move')
  }

export function previewScannedDelete(ctx) {
    const { index, state, requireScanRow, showToast, renderManageSelectedSource, switchManageTab, previewManage } = ctx
    let item
    try {
      item = requireScanRow(state.scanRows, index, 'Scanned target not found')
    } catch (err) {
      showToast(String(err.message || err))
      return
    }
    state.selectedSource = item.path
    renderManageSelectedSource()
    switchManageTab('delete')
    previewManage('delete')
  }

export const IndexerShellControls = {
  switchTab,
  setSearchSort,
  setBrowseSort,
  toggleBrowseRelativeTime,
  prefillManageFromBrowse,
  setManageSelectedSourceFromBrowse,
  useScannedDirectory,
  previewScannedCategorize,
  previewScannedMove,
  previewScannedDelete,
};
