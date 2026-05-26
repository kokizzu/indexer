import { showToast } from './_helpers/xNotifier.js';
import { renderSuggestionCards } from './_helpers/managePreview.js';
import { sortHeaderText, buildSearchRows, buildBrowseRows, renderTreeNode } from './_helpers/browseSearch.js';
import { tabHelpText, previewMeta, modeConfig } from './_helpers/manageUi.js';
import { renderManageTaskMeta, categorizeKindLabel, renderManageMessage, renderManageTaskCard, buildCategorizePreviewHtml } from './_helpers/categorizeQueue.js';
import { buildManagePlan as buildManagePlanImpl, renderManagePlanHtml, renderManageModalBodyHtml, renderSubtitleSuggestionHtml } from './_helpers/manageActions.js';
import { toggleSelection, hasSelection, buildCategorizeOperationsText, buildCategorizeGroupsText, buildCategorizeAmbiguousText, buildCategorizeCurrentViewText } from './_helpers/manageState.js';
import { buildStatusView, buildManageHistoryRows } from './_helpers/statusQueue.js';
import { categorizeOptionsFromState, applyCategorizeFilter, copyPlainText as copyPlainTextHelper, postJSON, batchQueueActions } from './_helpers/manageApi.js';
import { detectCategorySubdir, buildSuggestedScanRow, buildDeleteScanRows, toggleIndexSelection, selectAllRowIndexes, selectedRows } from './_helpers/manageScan.js';
import { pathRootAndRelative, buildManagePath as buildManagePathValue, renameTargetFromSource, nextSelectedSource } from './_helpers/managePaths.js';
import { selectedSourceText, managePathSelection, requireScanRow, suggestionPreviewData, renamePreviewState, movePreviewState } from './_helpers/manageSelection.js';
import { scanSuggestedRows, scanDeleteRows } from './_helpers/manageFlow.js';
import { applySortHeaders, applySearchTable, buildPriorityRootOptions, applyBrowseHistoryButtons, renderTreeHtml, applyBrowseSelection, relativeTimeButtonText, searchRelativeTimeTitle, applyBrowseTable } from './_helpers/searchBrowseFlow.js';
import { applyTabState, selectedPriorityRoots, reindexUrl, applyStatusView, searchRequestUrl, currentSearchQuery, currentSearchKind, applySearchPage } from './_helpers/pageFlow.js';
import { applyManagePreview, applyManageModal, closeManageModal as closeManageModalView, queueBodyFromPlan, applyManageQueueState, renderManageQueueHtml, applyManageHistoryState, applyManageHistoryHtml, toggleCategorizeSortState } from './_helpers/manageController.js';
import { applyManageTabState, applyManageTabHelp, applyManagePreviewMeta, unlockManagePreview, clearOptionalPaths, applyManageScanHeaders, applyManageSelectedSource, applyPathSelection, setManageScanCount } from './_helpers/managePane.js';
import { setManageResult, applySuggestionPreview, applySubtitleSuggestionPreview, resetCategorizePreviewState, hasCategorizePreview, queueBatchWithPassword, queueSingleWithPassword, setFilterAndRerender, toggleIdSelection, idSelected } from './_helpers/manageOps.js';
import { nextSortState, nextSearchPage, currentSearchKind as deriveSearchKind, normalizeSearchKinds as normalizeSearchKindsState, nextBrowseHistory, browseHistoryDisabled, parentDir, browseTarget } from './_helpers/pageState.js';
import * as BrowsePane from './_components/browsePane.js';
import * as IndexerPane from './_components/indexerPane.js';
import * as ManageChrome from './_components/manageChrome.js';
import * as ManageActionsPane from './_components/manageActionsPane.js';
import * as ManageWorkflow from './_components/manageWorkflow.js';
import * as ManageBatchPane from './_components/manageBatchPane.js';
import * as SearchPane from './_components/searchPane.js';
import * as QueuePane from './_components/queuePane.js';
import * as ShellControls from './_components/shellControls.js';

export function initAppController() {
    if (window.__indexerAppControllerBooted) return;
    window.__indexerAppControllerBooted = true;

    const browseState = {
      roots: [],
      expanded: new Set(),
      loaded: new Map(),
      selectedPath: '',
      history: [],
      historyIndex: -1,
      currentRows: [],
      sortBy: 'isDir',
      sortDesc: false,
      relativeTime: true
    }
    window.addEventListener('indexer:browseState', event => {
      const detail = event?.detail || {}
      browseState.roots = detail.roots || []
      browseState.selectedPath = detail.selectedPath || ''
      browseState.history = detail.history || []
      browseState.historyIndex = Number.isInteger(detail.historyIndex) ? detail.historyIndex : -1
      browseState.currentRows = detail.currentRows || []
      browseState.relativeTime = detail.relativeTime !== false
      browseState.sortBy = detail.sortBy || browseState.sortBy
      browseState.sortDesc = !!detail.sortDesc
      syncManageDefaults()
    })
    const manageState = {
      plan: null,
      tab: 'suggest',
      subtitleRows: [],
      scanRows: [],
      selectedSource: '',
      selectedScanRows: [],
      queueRows: [],
      historyRows: [],
      selectedQueueRows: [],
      selectedHistoryRows: [],
      categorizePreview: null,
      categorizeKindFilter: 'all',
      categorizeGroupFilter: '',
      categorizeTextFilter: '',
      categorizeAmbiguousFilter: '',
      categorizeGroupTextFilter: '',
      categorizeGroupSortBy: 'targetDir',
      categorizeGroupSortDesc: false,
      categorizeOpSortBy: 'target',
      categorizeOpSortDesc: false,
      categorizeAmbiguousSortBy: 'video',
      categorizeAmbiguousSortDesc: false
    }
    const searchState = {
      relativeTime: true,
      rows: [],
      total: 0,
      page: 0,
      pageSize: 100,
      sortBy: 'modifiedAt',
      sortDesc: true
    }
    const manageFormState = {
      scanRoot: '',
      scanPath: '',
      subtitleRoot: '',
      subtitlePath: '',
      suggestedName: '',
      renameTarget: '',
      dstRoot: '',
      dstSubdir: '',
      categorizeWatched: 0,
      categorizeVideosOnly: false,
      categorizeRemoveEmpty: true,
    }
    function syncManageFormState(patch = {}) {
      Object.assign(manageFormState, patch || {})
      window.dispatchEvent(new CustomEvent('indexer:manageForm', { detail: { patch } }))
    }
    window.addEventListener('indexer:manageForm', event => {
      const patch = event?.detail?.patch || {}
      Object.assign(manageFormState, patch)
    })
    function syncManageWorkflowState() {
      window.dispatchEvent(new CustomEvent('indexer:manageWorkflow', {
        detail: {
          tab: manageState.tab,
          scanConfig: manageModeConfig(),
          scanRows: manageState.scanRows || [],
          selectedScanRows: manageState.selectedScanRows || [],
          subtitleRows: manageState.subtitleRows || [],
        }
      }))
    }
    window.addEventListener('indexer:uiCommand', event => {
      const detail = event?.detail || {}
      if (detail.scope === 'tab' && detail.tab) {
        switchTab(detail.tab)
        return
      }
      if (detail.scope === 'manageTab' && detail.tab) {
        switchManageTab(detail.tab)
        return
      }
      if (detail.scope !== 'manageAction') return
      switch (detail.action) {
        case 'runManageModeScan':
          runManageModeScan()
          break
        case 'prefillManageFromBrowse':
          prefillManageFromBrowse(detail.kind || 'scan')
          break
        case 'toggleManageSelectAll':
          toggleManageSelectAll(!!detail.checked)
          break
        case 'toggleManageRowSelection':
          toggleManageRowSelection(detail.index, !!detail.checked)
          break
        case 'scanSubtitleCandidates':
          scanSubtitleCandidates()
          break
        case 'suggestRenameFromRenameTab':
          suggestRenameFromRenameTab()
          break
        case 'suggestSubtitleRenameFromRenameTab':
          suggestSubtitleRenameFromRenameTab()
          break
        case 'previewManage':
          previewManage(detail.mode || 'rename')
          break
        case 'previewScannedSuggest':
          previewScannedSuggest(detail.index)
          break
        case 'previewScannedRename':
          previewScannedRename(detail.index)
          break
        case 'previewScannedCategorize':
          previewScannedCategorize(detail.index)
          break
        case 'previewScannedMove':
          previewScannedMove(detail.index)
          break
        case 'previewScannedDelete':
          previewScannedDelete(detail.index)
          break
        case 'setManageSelectedSourceFromBrowse':
          setManageSelectedSourceFromBrowse()
          break
        case 'prefillManageRenameFromPath':
          prefillManageRenameFromPath(detail.path || '')
          break
        case 'closeManageModal':
          closeManageModal()
          break
        case 'confirmManage':
          confirmManage()
          break
        case 'queueSelectedCategorize':
          queueSelectedCategorize()
          break
        case 'queueSelectedRenames':
          queueSelectedRenames()
          break
        case 'queueSelectedMoves':
          queueSelectedMoves()
          break
        case 'queueSelectedDeletes':
          queueSelectedDeletes()
          break
        case 'queueSubtitleRename':
          queueSubtitleRename(detail.index)
          break
        case 'showInBrowse':
          showInBrowseEncoded(encodeURIComponent(detail.path || ''), detail.isDir ? 1 : 0)
          break
      }
    })

    async function getJSON(url, options = {}) {
      const res = await fetch(url, options)
      const text = await res.text()
      if (!res.ok) {
        showToast(text || ('HTTP ' + res.status))
        throw new Error(text)
      }
      return text ? JSON.parse(text) : {}
    }

    function switchTab(tab, event) {
      ShellControls.switchTab({
        tab,
        applyTabState,
        doc: document,
        storage: localStorage,
        syncManageDefaults,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    async function refreshStatus() {
      await IndexerPane.refreshStatus({
        getJSON,
        buildStatusView,
        applyStatusView,
        doc: document,
      })
    }

    async function startReindex() {
      await IndexerPane.startReindex({
        reindexUrl,
        selectedPriorityRoots,
        doc: document,
        getJSON,
        showToast,
        refreshStatus,
      })
    }

    async function runSearch() {
      await SearchPane.runSearch({
        doc: document,
        state: searchState,
        getJSON,
        currentSearchQuery,
        currentSearchKind,
        deriveSearchKind,
        searchRequestUrl,
        applySearchPage,
        renderSearchTable,
      })
    }

    function resetSearchAndRun() {
      SearchPane.resetSearchAndRun({
        state: searchState,
        runSearch,
      })
    }

    function toggleSearchRelativeTime() {
      SearchPane.toggleRelativeTime({
        doc: document,
        state: searchState,
        searchRelativeTimeTitle,
        renderSearchTable,
      })
    }

    function setSearchSort(field) {
      ShellControls.setSearchSort({
        field,
        state: searchState,
        nextSortState,
        updateSearchSortHeaders,
        renderSearchTable,
      })
    }

    function updateSearchSortHeaders() {
      SearchPane.updateSearchSortHeaders({
        doc: document,
        state: searchState,
        applySortHeaders,
        sortHeaderText,
      })
    }

    function renderSearchTable() {
      SearchPane.renderSearchTable({
        doc: document,
        state: searchState,
        applySearchTable,
        buildSearchRows,
      })
    }

    function changeSearchPage(delta) {
      SearchPane.changeSearchPage({
        delta,
        state: searchState,
        nextSearchPage,
        runSearch,
      })
    }

    function normalizeSearchKinds(changed) {
      SearchPane.normalizeSearchKinds({
        doc: document,
        changed,
        normalizeSearchKindsState,
      })
    }

    function onSearchKey(event) {
      SearchPane.onSearchKey({
        event,
        resetSearchAndRun,
      })
    }

    function updateBrowseHistoryButtons() {
      IndexerPane.updateBrowseHistoryButtons({
        doc: document,
        history: browseState.history,
        historyIndex: browseState.historyIndex,
        applyBrowseHistoryButtons,
        browseHistoryDisabled,
      })
    }

    async function reloadTree() {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'reload' } }))
    }

    function populatePriorityRoots() {
      IndexerPane.populatePriorityRoots({
        doc: document,
        roots: browseState.roots,
        buildPriorityRootOptions,
        escapeHtml,
      })
    }

    async function toggleNode(path) {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'toggleNode', path } }))
    }

    function renderTree() {
      BrowsePane.renderTree({
        doc: document,
        state: browseState,
        renderTreeHtml,
        renderTreeNode,
      })
    }

    async function selectNode(encodedPath) {
      await selectBrowsePath(decodeURIComponent(encodedPath))
    }

    async function selectBrowsePath(path, options = {}) {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'selectPath', path, options } }))
    }

    async function showInBrowseEncoded(encodedPath, isDir, event) {
      if (event) event.stopPropagation()
      const path = decodeURIComponent(encodedPath || '')
      const target = browseTarget(path, isDir)
      if (!target) {
        showToast('No browse target for this row')
        return
      }
      switchTab('browse')
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'show', path, isDir } }))
    }

    function setBrowseSort(field) {
      ShellControls.setBrowseSort({
        field,
        state: browseState,
        nextSortState,
        updateBrowseSortHeaders,
        renderBrowseTable,
      })
    }

    function updateBrowseSortHeaders() {
      applySortHeaders(document, 'browseSort-', {
        base: 'Name',
        isDir: 'Type',
        contents: 'Contents',
        size: 'Size',
        modifiedAt: 'Modified'
      }, browseState, sortHeaderText)
    }

    function toggleRelativeTime() {
      ShellControls.toggleBrowseRelativeTime({
        state: browseState,
        doc: document,
        relativeTimeButtonText,
        renderBrowseTable,
      })
    }

    function browseUp() {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'up' } }))
    }

    function browseBack() {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'back' } }))
    }

    function browseForward() {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'forward' } }))
    }

    async function openBrowsePath(encodedPath) {
      window.dispatchEvent(new CustomEvent('indexer:browseCommand', { detail: { kind: 'selectPath', path: decodeURIComponent(encodedPath || '') } }))
    }

    async function copyPathEncoded(encodedPath, event) {
      await BrowsePane.copyPathEncoded({
        encodedPath,
        event,
        navigatorRef: navigator,
        showToast,
      })
    }

    function renderBrowseTable() {
      applyBrowseTable(document, browseState, buildBrowseRows)
    }

    function switchManageTab(tab, event) {
      ManageWorkflow.switchTab({
        tab,
        state: manageState,
        applyManageTabState,
        unlockManagePreview,
        updateManageTabHelp,
        syncManageDefaults,
        updateManageScanUI,
        updateManagePreviewUI,
        doc: document,
      })
      syncManageWorkflowState()
    }

    function updateManageTabHelp() {
      ManageChrome.updateTabHelp({
        doc: document,
        tab: manageState.tab,
        applyManageTabHelp,
        tabHelpText,
      })
    }

    function updateManagePreviewUI() {
      ManageChrome.updatePreviewUI({
        doc: document,
        tab: manageState.tab,
        applyManagePreviewMeta,
        previewMeta,
      })
    }

    function clearManageOptionalPaths() {
      ManageChrome.clearOptionalPaths({
        doc: document,
        clearOptionalPaths,
      })
      syncManageFormState({ scanPath: '', subtitlePath: '' })
    }

    function manageModeConfig() {
      return modeConfig(manageState.tab)
    }

    function updateManageScanUI() {
      syncManageWorkflowState()
    }

    function renderManageBatchActions() {
      syncManageWorkflowState()
    }

    function syncManageRenamePath() {
      const renameTarget = document.getElementById('manageRenameTarget')
      if (!manageState.selectedSource) {
        syncManageFormState({ suggestedName: '', renameTarget: '' })
        return
      }
      if (renameTarget?.dataset.manual) return
      syncManageFormState({ renameTarget: renameTargetFromSource(manageState.selectedSource) })
    }

    function renderManageSelectedSource() {
      ManageChrome.renderSelectedSource({
        doc: document,
        selectedSource: manageState.selectedSource,
        applyManageSelectedSource,
        selectedSourceText,
      })
    }

    function buildManagePath(rootID, pathID) {
      return ManageWorkflow.buildPath(document, rootID, pathID, buildManagePathValue, manageFormState)
    }

    function prefillManageFromBrowse(kind) {
      ShellControls.prefillManageFromBrowse({
        browseState,
        kind,
        showToast,
        prefillManageFromPath,
      })
    }

    function setManageSelectedSourceFromBrowse() {
      ShellControls.setManageSelectedSourceFromBrowse({
        browseState,
        state: manageState,
        showToast,
        renderManageSelectedSource,
        syncManageRenamePath,
        populateManageCategorySubdir,
      })
    }

    function prefillManageRenameFromPath(path) {
      const clean = String(path || '').trim()
      if (!clean) {
        showToast('Rename path is required')
        return
      }
      switchTab('manage')
      switchManageTab('rename')
      manageState.selectedSource = clean
      renderManageSelectedSource()
      syncManageRenamePath()
      populateManageCategorySubdir(manageState.selectedSource)
    }

    function prefillManageFromPath(kind, fullPath) {
      ManageWorkflow.prefillFromPath({
        kind,
        fullPath,
        state: manageState,
        roots: {
          list: browseState.roots,
          pathRootAndRelative,
        },
        managePathSelection,
        applyPathSelection,
        renderManageSelectedSource,
        syncManageRenamePath,
        populateManageCategorySubdir,
        syncManageFormState,
        doc: document,
      })
    }

    function syncManageDefaults() {
      ManageWorkflow.syncDefaults({
        browseState,
        state: manageState,
        doc: document,
        manageFormState,
        syncManageFormState,
        roots: {
          pathRootAndRelative,
          nextSelectedSource,
        },
        renderManageSelectedSource,
        syncManageRenamePath,
        populateManageCategorySubdir,
        clearManageOptionalPaths,
        updateManageScanUI,
      })
    }

    function populateManageCategorySubdir(path) {
      if (String(manageFormState.dstSubdir || '').trim()) return
      const detected = detectCategorySubdir(path)
      if (detected) syncManageFormState({ dstSubdir: detected })
    }

    async function suggestRename() {
      await ManageActionsPane.suggestRename({
        state: manageState,
        showToast,
        getJSON,
        renderSuggestionCards,
        applySuggestionPreview,
        doc: document,
      })
    }

    async function runManageModeScan() {
      return ManageWorkflow.runModeScan({
        state: manageState,
        scanManageDeleteTargets,
        scanManageDirectories,
      })
    }

    async function scanManageDirectories(mode = manageState.tab) {
      await ManageWorkflow.scanManageDirectories({
        doc: document,
        state: manageState,
        formState: manageFormState,
        buildManagePathValue,
        showToast,
        setManageScanCount,
        scanSuggestedRows,
        getJSON,
        postJSON,
        buildSuggestedScanRow,
      })
      syncManageWorkflowState()
    }

    async function scanManageDeleteTargets() {
      await ManageWorkflow.scanManageDeleteTargets({
        doc: document,
        state: manageState,
        formState: manageFormState,
        buildManagePathValue,
        showToast,
        setManageScanCount,
        scanDeleteRows,
        getJSON,
        buildDeleteScanRows,
      })
      syncManageWorkflowState()
    }

    function renderManageScanTable() {
      syncManageWorkflowState()
    }

    function isManageRowSelected(idx) {
      return ManageBatchPane.isRowSelected({
        state: manageState,
        idx,
      })
    }

    function toggleManageRowSelection(idx, checked) {
      ManageBatchPane.toggleRowSelection({
        state: manageState,
        idx,
        checked,
        toggleIndexSelection,
        renderManageBatchActions,
      })
      syncManageWorkflowState()
    }

    function toggleManageSelectAll(checked) {
      ManageBatchPane.toggleSelectAll({
        state: manageState,
        checked,
        selectAllRowIndexes,
        renderManageBatchActions,
      })
      syncManageWorkflowState()
    }

    function selectedManageRows() {
      return ManageBatchPane.selectedRowsForBatch({
        state: manageState,
        selectedRows,
      })
    }

    async function queueSelectedCategorize() {
      await ManageBatchPane.queueSelectedCategorize({
        state: manageState,
        categorizeOptionsFromUI,
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows,
      })
    }

    async function queueSelectedRenames() {
      await ManageBatchPane.queueSelectedRenames({
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows,
      })
    }

    async function queueSelectedMoves() {
      await ManageBatchPane.queueSelectedMoves({
        formState: manageFormState,
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows,
      })
    }

    async function queueSelectedDeletes() {
      await ManageBatchPane.queueSelectedDeletes({
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows,
      })
    }

    function useScannedDirectory(index) {
      ShellControls.useScannedDirectory({
        index,
        state: manageState,
        requireScanRow,
        showToast,
        prefillManageFromPath,
      })
    }

    function previewScannedSuggest(index) {
      ManageWorkflow.previewScannedSuggest({
        index,
        state: manageState,
        requireScanRow,
        showToast,
        renderManageSelectedSource,
        applySuggestionPreview,
        renderSuggestionCards,
        suggestionPreviewData,
        doc: document,
      })
    }

    function previewScannedRename(index) {
      ManageWorkflow.previewScannedRename({
        index,
        state: manageState,
        requireScanRow,
        showToast,
        renamePreviewState,
        renderManageSelectedSource,
        switchManageTab,
        syncManageFormState,
        doc: document,
        applySuggestionPreview,
        renderSuggestionCards,
      })
    }

    function previewScannedCategorize(index) {
      ShellControls.previewScannedCategorize({
        index,
        state: manageState,
        requireScanRow,
        showToast,
        renderManageSelectedSource,
        switchManageTab,
        previewCategorize,
      })
    }

    function prepareScannedMove(index) {
      ManageWorkflow.prepareScannedMove({
        index,
        state: manageState,
        requireScanRow,
        showToast,
        movePreviewState,
        renderManageSelectedSource,
        populateManageCategorySubdir,
        switchManageTab,
      })
    }

    function previewScannedMove(index) {
      ShellControls.previewScannedMove({
        index,
        prepareScannedMove,
        previewManage,
      })
    }

    function previewScannedDelete(index) {
      ShellControls.previewScannedDelete({
        index,
        state: manageState,
        requireScanRow,
        showToast,
        renderManageSelectedSource,
        switchManageTab,
        previewManage,
      })
    }

    async function scanSubtitleCandidates() {
      await ManageWorkflow.scanSubtitleCandidates({
        doc: document,
        state: manageState,
        formState: manageFormState,
        buildManagePathValue,
        showToast,
        getJSON,
      })
      syncManageWorkflowState()
    }

    async function queueSubtitleRename(index, event) {
      await ManageBatchPane.queueSubtitleRename({
        index,
        event,
        state: manageState,
        queueSingleWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        postJSON,
        doc: document,
        renderSubtitleCandidates: syncManageWorkflowState,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
      })
    }

    async function previewCategorize() {
      await ManageActionsPane.previewCategorize({
        state: manageState,
        showToast,
        categorizeOptionsFromUI,
        formState: manageFormState,
        postJSON,
        getJSON,
        resetCategorizePreviewState,
        renderCategorizePreview,
      })
    }

    async function queueCategorize() {
      await ManageActionsPane.queueCategorize({
        state: manageState,
        showToast,
        promptFn: window.prompt.bind(window),
        categorizeOptionsFromUI,
        formState: manageFormState,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    async function suggestRenameFromRenameTab() {
      await ManageActionsPane.suggestRenameFromRenameTab({
        state: manageState,
        showToast,
        postJSON,
        getJSON,
        syncManageFormState,
        doc: document,
        applySuggestionPreview,
        renderSuggestionCards,
      })
    }

    async function suggestSubtitleRenameFromRenameTab() {
      await ManageActionsPane.suggestSubtitleRenameFromRenameTab({
        state: manageState,
        showToast,
        postJSON,
        getJSON,
        syncManageFormState,
        doc: document,
        applySubtitleSuggestionPreview,
        renderSubtitleSuggestionHtml,
      })
    }

    function buildManagePlan(action) {
      return ManageActionsPane.buildManagePlan({
        state: manageState,
        formState: manageFormState,
        buildManagePlanImpl,
        action,
      })
    }

    function renderManagePlan(plan) {
      ManageActionsPane.renderManagePlan({
        doc: document,
        plan,
        applyManagePreview,
        renderManagePlanHtml,
      })
    }

    function renderManageModal(plan) {
      ManageActionsPane.renderManageModal({
        doc: document,
        plan,
        applyManageModal,
        renderManageModalBodyHtml,
      })
    }

    async function refreshManageQueue() {
      window.dispatchEvent(new CustomEvent('indexer:queueRefreshRequest'))
    }

    async function refreshManageHistory() {
      window.dispatchEvent(new CustomEvent('indexer:historyRefreshRequest'))
    }

    function closeManageModal(event) {
      ManageActionsPane.closeManageModal({
        doc: document,
        event,
        closeManageModalView,
      })
    }

    function previewManage(action) {
      ManageActionsPane.previewManage({
        action,
        state: manageState,
        buildManagePlan,
        renderManagePlan,
        renderManageModal,
        showToast,
      })
    }

    async function confirmManage() {
      await ManageActionsPane.confirmManage({
        state: manageState,
        showToast,
        promptFn: window.prompt.bind(window),
        queueBodyFromPlan,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        closeManageModal,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    function categorizeOptionsFromUI() {
      return ManageActionsPane.categorizeOptionsFromUI({
        formState: manageFormState,
        categorizeOptionsFromState,
      })
    }

    async function copyPlainText(text, event) {
      await ManageActionsPane.copyPlainText({
        text,
        event,
        copyPlainTextHelper,
        navigatorRef: navigator,
        showToast,
      })
    }

    async function copyCategorizeFilteredOperations() {
      await ManageActionsPane.copyCategorizeFilteredOperations({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeOperationsText,
        categorizeKindLabel,
        copyPlainText,
      })
    }

    async function copyCategorizeFilteredAmbiguous() {
      await ManageActionsPane.copyCategorizeFilteredAmbiguous({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeAmbiguousText,
        copyPlainText,
      })
    }

    async function copyCategorizeFilteredGroups() {
      await ManageActionsPane.copyCategorizeFilteredGroups({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeGroupsText,
        copyPlainText,
      })
    }

    async function copyCategorizeCurrentView() {
      await ManageActionsPane.copyCategorizeCurrentView({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeCurrentViewText,
        categorizeKindLabel,
        copyPlainText,
      })
    }

    function setCategorizeKindFilter(kind) {
      ManageActionsPane.setCategorizeFilter({
        state: manageState,
        patch: { categorizeKindFilter: kind || 'all' },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview,
      })
    }

    function setCategorizeGroupFilter(group) {
      ManageActionsPane.setCategorizeFilter({
        state: manageState,
        patch: { categorizeGroupFilter: String(group || '') },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview,
      })
    }

    function setCategorizeTextFilter(value) {
      ManageActionsPane.setCategorizeFilter({
        state: manageState,
        patch: { categorizeTextFilter: String(value || '') },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview,
      })
    }

    function setCategorizeAmbiguousFilter(value) {
      ManageActionsPane.setCategorizeFilter({
        state: manageState,
        patch: { categorizeAmbiguousFilter: String(value || '') },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview,
      })
    }

    function setCategorizeGroupTextFilter(value) {
      ManageActionsPane.setCategorizeFilter({
        state: manageState,
        patch: { categorizeGroupTextFilter: String(value || '') },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview,
      })
    }

    function resetCategorizeFilters() {
      ManageActionsPane.resetCategorizeFilters({
        state: manageState,
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview,
      })
    }

    function toggleCategorizeSort(which, field) {
      ManageActionsPane.toggleCategorizeSort({
        state: manageState,
        which,
        field,
        toggleCategorizeSortState,
        renderStoredCategorizePreview,
      })
    }

    function renderStoredCategorizePreview() {
      ManageActionsPane.renderStoredCategorizePreview({
        state: manageState,
        renderCategorizePreview,
      })
    }

    function renderCategorizePreview(res, opts) {
      ManageActionsPane.renderCategorizePreview({
        doc: document,
        res,
        opts,
        state: manageState,
        buildCategorizePreviewHtml,
      })
    }

    function isManageQueueSelected(id) {
      return QueuePane.isQueueRowSelected({
        state: manageState,
        id,
        idSelected,
        hasSelection,
      })
    }

    function toggleManageQueueSelection(id, checked) {
      QueuePane.toggleQueueRowSelected({
        state: manageState,
        id,
        checked,
        toggleIdSelection,
        toggleSelection,
      })
    }

    function isManageHistorySelected(id) {
      return QueuePane.isHistoryRowSelected({
        state: manageState,
        id,
        idSelected,
        hasSelection,
      })
    }

    function toggleManageHistorySelection(id, checked) {
      QueuePane.toggleHistoryRowSelected({
        state: manageState,
        id,
        checked,
        toggleIdSelection,
        toggleSelection,
      })
    }

    async function cancelManageTask(id) {
      await QueuePane.cancelTask({
        id,
        showToast,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    async function cancelSelectedManageTasks() {
      await QueuePane.cancelSelected({
        state: manageState,
        showToast,
        batchQueueActions,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    async function retryManageHistoryTask(id) {
      await QueuePane.retryHistoryTask({
        id,
        promptFn: window.prompt.bind(window),
        showToast,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    async function retrySelectedManageHistoryTasks() {
      await QueuePane.retrySelected({
        state: manageState,
        promptFn: window.prompt.bind(window),
        showToast,
        batchQueueActions,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
      })
    }

    switchManageTab('suggest')
    clearManageOptionalPaths()
    syncManageFormState(manageFormState)
    syncManageWorkflowState()
}
