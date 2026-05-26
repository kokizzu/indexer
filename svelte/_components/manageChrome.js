export function updateTabHelp(ctx) {
    const { doc, tab, applyManageTabHelp, tabHelpText } = ctx
    applyManageTabHelp(doc, tabHelpText(tab))
  }

export function updatePreviewUI(ctx) {
    const { doc, tab, applyManagePreviewMeta, previewMeta } = ctx
    applyManagePreviewMeta(doc, previewMeta(tab))
  }

export function clearOptionalPaths(ctx) {
    const { doc, clearOptionalPaths } = ctx
    clearOptionalPaths(doc, ['manageScanPath', 'manageSubtitlePath'])
  }

export function updateScanUI(ctx) {
    const { doc, tab, modeConfig, applyManageScanHeaders, renderManageBatchActions, renderManageScanTable } = ctx
    const config = modeConfig(tab)
    applyManageScanHeaders(doc, tab, config)
    renderManageBatchActions()
    renderManageScanTable()
  }

export function syncRenamePath(ctx) {
    const { doc, selectedSource, syncRenameTarget, renameTargetFromSource } = ctx
    syncRenameTarget(doc, selectedSource || '', renameTargetFromSource)
  }

export function renderSelectedSource(ctx) {
    const { doc, selectedSource, applyManageSelectedSource, selectedSourceText } = ctx
    applyManageSelectedSource(doc, selectedSourceText(selectedSource))
  }

export const IndexerManageChrome = {
  updateTabHelp,
  updatePreviewUI,
  clearOptionalPaths,
  updateScanUI,
  syncRenamePath,
  renderSelectedSource,
};
