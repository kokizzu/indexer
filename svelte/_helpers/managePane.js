export function applyManageTabState(doc, tab) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:manageTab', {
      detail: { tab: tab || 'suggest' }
    }))
  }

export function applyManageTabHelp(doc, text) {
    const help = doc.getElementById('manageTabHelp')
    if (help) help.textContent = text || ''
  }

export function applyManagePreviewMeta(doc, meta) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
      detail: {
        kind: 'meta',
        title: meta.title || '',
        previewHtml: meta.placeholder || '',
      }
    }))
  }

export function unlockManagePreview(doc) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
      detail: { kind: 'unlock' }
    }))
  }

export function clearOptionalPaths(doc, ids) {
    ;(ids || []).forEach(id => {
      const el = doc.getElementById(id)
      if (!el) return
      if (!el.dataset.manual) el.value = ''
    })
  }

export function applyManageScanHeaders(doc, tab, config) {
    const title = doc.getElementById('manageScanTitle')
    const btn = doc.getElementById('manageScanBtn')
    if (title) title.textContent = config.title || ''
    if (btn) btn.textContent = config.button || ''
    const statusHead = doc.getElementById('manageScanHeadStatus')
    const suggestedHead = doc.getElementById('manageScanHeadSuggested')
    if (statusHead) statusHead.textContent = tab === 'delete' ? 'Type' : 'Status'
    if (suggestedHead) suggestedHead.textContent = tab === 'delete' ? 'Path' : 'Suggested'
  }

export function applyManageSelectedSource(doc, text) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
      detail: {
        kind: 'selectedSource',
        selectedSource: text || '',
      }
    }))
  }

export function syncRenameTarget(doc, path, renameTargetFromSource) {
    const renameTarget = doc.getElementById('manageRenameTarget')
    const suggested = doc.getElementById('manageSuggestedName')
    if (!path) {
      if (suggested) suggested.value = ''
      if (renameTarget) renameTarget.value = ''
      return
    }
    if (renameTarget && !renameTarget.dataset.manual) {
      renameTarget.value = renameTargetFromSource(path)
    }
  }

export function applyPathSelection(doc, rootID, pathID, selection) {
    const rootEl = doc.getElementById(rootID)
    const pathEl = doc.getElementById(pathID)
    if (rootEl && selection.root) rootEl.value = selection.root
    if (!pathEl) return
    pathEl.value = selection.rel || ''
    if (selection.markManual) pathEl.dataset.manual = '1'
    else delete pathEl.dataset.manual
  }

export function setManageScanCount(doc, text) {
    const el = doc.getElementById('manageScanCount')
    if (el) el.textContent = text
  }

export const IndexerManagePane = {
  applyManageTabState,
  applyManageTabHelp,
  applyManagePreviewMeta,
  unlockManagePreview,
  clearOptionalPaths,
  applyManageScanHeaders,
  applyManageSelectedSource,
  syncRenameTarget,
  applyPathSelection,
  setManageScanCount,
};
