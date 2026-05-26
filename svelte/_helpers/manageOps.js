export function setManageResult(doc, value) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:manageResult', {
      detail: { value }
    }))
  }

export function applySuggestionPreview(doc, renderSuggestionCards, data, title) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
      detail: {
        kind: 'preview',
        previewHtml: renderSuggestionCards(data, title),
      }
    }))
  }

export function applySubtitleSuggestionPreview(doc, renderSubtitleSuggestionHtml, res, path) {
    doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
      detail: {
        kind: 'preview',
        previewHtml: renderSubtitleSuggestionHtml(res, path),
      }
    }))
  }

export function resetCategorizePreviewState(state, res, opts) {
    state.categorizePreview = { res, opts }
    state.categorizeKindFilter = 'all'
    state.categorizeGroupFilter = ''
    state.categorizeTextFilter = ''
    state.categorizeAmbiguousFilter = ''
    state.categorizeGroupTextFilter = ''
  }

export function hasCategorizePreview(state) {
    return Boolean(state && state.categorizePreview)
  }

export async function queueBatchWithPassword(ctx) {
    const {
      rows, promptFn, promptText, missingRowsMessage, missingPasswordMessage,
      getJSON, batchQueueActions, requestBuilder, doc,
      successMessage, partialMessage, resultBuilder, after,
    } = ctx
    if (!(rows || []).length) throw new Error(missingRowsMessage)
    const password = (promptFn(promptText) || '')
    if (!password) throw new Error(missingPasswordMessage)
    const { queued, errors } = await batchQueueActions(getJSON, rows, item => requestBuilder(item, password))
    setManageResult(doc, resultBuilder ? resultBuilder({ queued, errors }) : { queued, errors })
    if (typeof after === 'function') await after()
    return { queued, errors, toast: errors.length ? partialMessage : (successMessage + queued) }
  }

export async function queueSingleWithPassword(ctx) {
    const {
      item, promptFn, promptText, missingItemMessage, missingPasswordMessage,
      getJSON, postJSON, url, bodyBuilder, doc, after,
    } = ctx
    if (!item) throw new Error(missingItemMessage)
    const password = (promptFn(promptText) || '')
    if (!password) throw new Error(missingPasswordMessage)
    const res = await postJSON(getJSON, url, bodyBuilder(item, password))
    setManageResult(doc, res)
    if (typeof after === 'function') await after(res)
    return res
  }

export function setFilterAndRerender(state, patch, applyCategorizeFilter, rerender) {
    applyCategorizeFilter(state, patch)
    rerender()
  }

export function toggleIdSelection(state, key, id, checked, toggleSelection) {
    state[key] = toggleSelection(state[key], id, checked)
    return state[key]
  }

export function idSelected(state, key, id, hasSelection) {
    return hasSelection(state[key], id)
  }

export const IndexerManageOps = {
  setManageResult,
  applySuggestionPreview,
  applySubtitleSuggestionPreview,
  resetCategorizePreviewState,
  hasCategorizePreview,
  queueBatchWithPassword,
  queueSingleWithPassword,
  setFilterAndRerender,
  toggleIdSelection,
  idSelected,
};
