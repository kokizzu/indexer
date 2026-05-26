import IndexerApi from '../jsApi.GEN.js';

export async function reloadTree(ctx) {
    const { state, getJSON, populatePriorityRoots, renderTree, updateBrowseHistoryButtons, selectBrowsePath } = ctx
    state.expanded.clear()
    state.loaded.clear()
    state.selectedPath = ''
    state.history = []
    state.historyIndex = -1
    state.roots = await getJSON(IndexerApi.browse)
    populatePriorityRoots()
    renderTree()
    updateBrowseHistoryButtons()
    if (state.roots.length) {
      await selectBrowsePath(state.roots[0].path)
    }
  }

export async function toggleNode(ctx) {
    const { state, path, getJSON, renderTree } = ctx
    if (state.expanded.has(path)) {
      state.expanded.delete(path)
      renderTree()
      return
    }
    state.expanded.add(path)
    if (!state.loaded.has(path)) {
      const rows = await getJSON(IndexerApi.browse + '?path=' + encodeURIComponent(path))
      state.loaded.set(path, rows.filter(item => item.isDir))
    }
    renderTree()
  }

export function renderTree(ctx) {
    const { doc, state, renderTreeHtml, renderTreeNode } = ctx
    const el = doc.getElementById('browseTree')
    if (!el) return
    el.innerHTML = renderTreeHtml(state.roots, renderTreeNode, state)
  }

export async function selectBrowsePath(ctx) {
    const { state, path, options, getJSON, nextBrowseHistory, updateBrowseHistoryButtons, renderTree, applyBrowseSelection, syncManageDefaults, renderBrowseTable } = ctx
    const next = nextBrowseHistory(state.history, state.historyIndex, path, options.pushHistory !== false)
    state.selectedPath = next.selectedPath
    state.history = next.history
    state.historyIndex = next.historyIndex
    updateBrowseHistoryButtons()
    renderTree()
    state.currentRows = await getJSON(IndexerApi.browse + '?path=' + encodeURIComponent(path))
    applyBrowseSelection(path)
    syncManageDefaults()
    renderBrowseTable()
  }

export async function showInBrowseEncoded(ctx) {
    const { encodedPath, isDir, event, browseTarget, switchTab, selectBrowsePath, showToast } = ctx
    if (event) event.stopPropagation()
    const path = decodeURIComponent(encodedPath || '')
    const target = browseTarget(path, isDir)
    if (!target) {
      showToast('No browse target for this row')
      return
    }
    switchTab('browse')
    await selectBrowsePath(target)
  }

export function browseUp(ctx) {
    const { state, parentDir, selectBrowsePath } = ctx
    const parent = parentDir(state.selectedPath)
    if (!parent || parent === state.selectedPath) return
    selectBrowsePath(parent)
  }

export function browseBack(ctx) {
    const { state, updateBrowseHistoryButtons, selectBrowsePath } = ctx
    if (state.historyIndex <= 0) return
    state.historyIndex--
    updateBrowseHistoryButtons()
    selectBrowsePath(state.history[state.historyIndex], { pushHistory: false })
  }

export function browseForward(ctx) {
    const { state, updateBrowseHistoryButtons, selectBrowsePath } = ctx
    if (state.historyIndex >= state.history.length - 1) return
    state.historyIndex++
    updateBrowseHistoryButtons()
    selectBrowsePath(state.history[state.historyIndex], { pushHistory: false })
  }

export async function openBrowsePath(ctx) {
    await ctx.selectBrowsePath(decodeURIComponent(ctx.encodedPath))
  }

export async function copyPathEncoded(ctx) {
    const { encodedPath, event, navigatorRef, showToast } = ctx
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    try {
      await navigatorRef.clipboard.writeText(decodeURIComponent(encodedPath || ''))
      showToast('Copied path')
    } catch (err) {
      showToast('Copy failed: ' + err)
    }
  }

export const IndexerBrowsePane = {
  reloadTree,
  toggleNode,
  renderTree,
  selectBrowsePath,
  showInBrowseEncoded,
  browseUp,
  browseBack,
  browseForward,
  openBrowsePath,
  copyPathEncoded,
};
