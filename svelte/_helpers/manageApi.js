import IndexerApi from '../jsApi.GEN.js';

  export function categorizeOptionsFromState(formState) {
    const src = formState || {}
    return {
      videosOnly: !!src.categorizeVideosOnly,
      watchedCount: Number(src.categorizeWatched || 0) || 0,
      removeEmptyDirs: !!src.categorizeRemoveEmpty
    }
  }

  export function categorizeOptionsFromDOM(doc) {
    return categorizeOptionsFromState({
      categorizeVideosOnly: !!doc.getElementById('manageCategorizeVideosOnly')?.checked,
      categorizeWatched: Number(doc.getElementById('manageCategorizeWatched')?.value || 0) || 0,
      categorizeRemoveEmpty: !!doc.getElementById('manageCategorizeRemoveEmpty')?.checked
    })
  }

  export function applyCategorizeFilter(state, patch) {
    Object.assign(state, patch || {})
    return state
  }

  export async function copyPlainText(text, navigatorObj) {
    await navigatorObj.clipboard.writeText(String(text || ''))
  }

  export async function postJSON(getJSON, url, body) {
    return getJSON(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  }

  export async function batchQueueActions(getJSON, items, buildBody) {
    let queued = 0
    const errors = []
    for (const item of (items || [])) {
      try {
        await postJSON(getJSON, IndexerApi.manageQueue, buildBody(item))
        queued++
      } catch (err) {
        errors.push(String(err))
      }
    }
    return { queued, errors }
  }

export const IndexerManageApi = {
  categorizeOptionsFromState,
  categorizeOptionsFromDOM,
  applyCategorizeFilter,
  copyPlainText,
  postJSON,
  batchQueueActions,
};
