import IndexerApi from '../jsApi.GEN.js';

export function buildPath(doc, rootID, pathID, buildManagePathValue, formState) {
    const keyMap = {
      manageScanRoot: 'scanRoot',
      manageScanPath: 'scanPath',
      manageSubtitleRoot: 'subtitleRoot',
      manageSubtitlePath: 'subtitlePath',
    }
    const root = (formState?.[keyMap[rootID]] ?? doc.getElementById(rootID)?.value) || ''
    const rel = (formState?.[keyMap[pathID]] ?? doc.getElementById(pathID)?.value) || ''
    return buildManagePathValue(root, rel)
  }

export function prefillFromPath(ctx) {
    const { kind, fullPath, state, roots, managePathSelection, applyPathSelection, renderManageSelectedSource, syncManageRenamePath, populateManageCategorySubdir, syncManageFormState, doc } = ctx
    const mapping = {
      scan: ['manageScanRoot', 'manageScanPath'],
      subtitles: ['manageSubtitleRoot', 'manageSubtitlePath'],
    }
    const selection = managePathSelection(kind, fullPath, roots.list, roots.pathRootAndRelative)
    if (selection.selectedSource) {
      state.selectedSource = selection.selectedSource
      renderManageSelectedSource()
      syncManageRenamePath()
      populateManageCategorySubdir(state.selectedSource)
    }
    const pair = mapping[kind]
    if (!pair) return
    applyPathSelection(doc, pair[0], pair[1], selection)
    if (kind === 'scan') syncManageFormState({ scanRoot: selection.root || '', scanPath: selection.rel || '' })
    if (kind === 'subtitles') syncManageFormState({ subtitleRoot: selection.root || '', subtitlePath: selection.rel || '' })
  }

export function syncDefaults(ctx) {
    const { browseState, state, roots, manageFormState, syncManageFormState, renderManageSelectedSource, syncManageRenamePath, populateManageCategorySubdir, clearManageOptionalPaths, updateManageScanUI } = ctx
    const selected = browseState.selectedPath || ''
    if (selected) {
      if (!manageFormState.scanRoot) {
        const parts = roots.pathRootAndRelative(selected, browseState.roots)
        if (parts.root) syncManageFormState({ scanRoot: parts.root })
      }
      state.selectedSource = roots.nextSelectedSource(state.selectedSource, selected)
    }
    renderManageSelectedSource()
    syncManageRenamePath()
    populateManageCategorySubdir(state.selectedSource || selected)
    clearManageOptionalPaths()
    updateManageScanUI()
  }

export function switchTab(ctx) {
    const { tab, state, applyManageTabState, unlockManagePreview, updateManageTabHelp, syncManageDefaults, updateManageScanUI, updateManagePreviewUI, doc } = ctx
    state.tab = tab
    applyManageTabState(doc, tab)
    state.plan = null
    unlockManagePreview(doc)
    updateManageTabHelp()
    syncManageDefaults()
    updateManageScanUI()
    updateManagePreviewUI()
  }

export async function runModeScan(ctx) {
    if (ctx.state.tab === 'delete') return ctx.scanManageDeleteTargets()
    return ctx.scanManageDirectories(ctx.state.tab)
  }

export async function scanManageDirectories(ctx) {
    const { doc, state, formState, buildManagePathValue, showToast, setManageScanCount, scanSuggestedRows, getJSON, postJSON, buildSuggestedScanRow } = ctx
    const path = buildPath(doc, 'manageScanRoot', 'manageScanPath', buildManagePathValue, formState)
    if (!path) {
      showToast('Scan path is required')
      return
    }
    setManageScanCount(doc, 'scanning...')
    state.scanRows = await scanSuggestedRows({
      getJSON,
      postJSON,
      rootPath: path,
      limit: 300,
      mode: state.tab,
      buildSuggestedScanRow,
    })
    state.selectedScanRows = []
  }

export async function scanManageDeleteTargets(ctx) {
    const { doc, state, formState, buildManagePathValue, showToast, setManageScanCount, scanDeleteRows, getJSON, buildDeleteScanRows } = ctx
    const path = buildPath(doc, 'manageScanRoot', 'manageScanPath', buildManagePathValue, formState)
    if (!path) {
      showToast('Scan path is required')
      return
    }
    setManageScanCount(doc, 'scanning...')
    state.scanRows = await scanDeleteRows({
      getJSON,
      rootPath: path,
      limit: 300,
      buildDeleteScanRows,
    })
    state.selectedScanRows = []
  }

export function previewScannedSuggest(ctx) {
    const { index, state, requireScanRow, showToast, renderManageSelectedSource, applySuggestionPreview, renderSuggestionCards, suggestionPreviewData, doc } = ctx
    let item
    try {
      item = requireScanRow(state.scanRows, index, 'Scanned directory not found')
    } catch (err) {
      showToast(String(err.message || err))
      return
    }
    state.selectedSource = item.path
    renderManageSelectedSource()
    applySuggestionPreview(doc, renderSuggestionCards, suggestionPreviewData(item), 'Suggestion Preview')
  }

export function previewScannedRename(ctx) {
    const { index, state, requireScanRow, showToast, renamePreviewState, renderManageSelectedSource, switchManageTab, syncManageFormState, doc, applySuggestionPreview, renderSuggestionCards } = ctx
    let item
    try {
      item = requireScanRow(state.scanRows, index, 'Scanned directory not found')
    } catch (err) {
      showToast(String(err.message || err))
      return
    }
    const next = renamePreviewState(item)
    state.selectedSource = next.selectedSource
    renderManageSelectedSource()
    switchManageTab('rename')
    syncManageFormState({
      suggestedName: next.suggestedName,
      renameTarget: next.renameTarget,
    })
    const target = doc.getElementById('manageRenameTarget')
    if (target) delete target.dataset.manual
    applySuggestionPreview(doc, renderSuggestionCards, next.preview, 'Rename Suggestion')
  }

export function prepareScannedMove(ctx) {
    const { index, state, requireScanRow, showToast, movePreviewState, renderManageSelectedSource, populateManageCategorySubdir, switchManageTab } = ctx
    let item
    try {
      item = requireScanRow(state.scanRows, index, 'Scanned directory not found')
    } catch (err) {
      showToast(String(err.message || err))
      return
    }
    const next = movePreviewState(item)
    state.selectedSource = next.selectedSource
    renderManageSelectedSource()
    populateManageCategorySubdir(next.categoryPath)
    switchManageTab('move')
  }

export async function scanSubtitleCandidates(ctx) {
    const { doc, state, formState, buildManagePathValue, showToast, getJSON } = ctx
    const path = buildPath(doc, 'manageSubtitleRoot', 'manageSubtitlePath', buildManagePathValue, formState)
    if (!path) {
      showToast('Scan path is required')
      return
    }
    const rows = await getJSON(IndexerApi.scanSubtitles, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, limit: 500 })
    })
    state.subtitleRows = rows || []
  }

export const IndexerManageWorkflow = {
  buildPath,
  prefillFromPath,
  syncDefaults,
  switchTab,
  runModeScan,
  scanManageDirectories,
  scanManageDeleteTargets,
  previewScannedSuggest,
  previewScannedRename,
  prepareScannedMove,
  scanSubtitleCandidates,
};
