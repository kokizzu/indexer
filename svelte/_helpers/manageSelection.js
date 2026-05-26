export function selectedSourceText(path) {
    return path ? ('Selected source: ' + path) : '(no candidate selected yet)'
  }

export function managePathSelection(kind, fullPath, roots, pathRootAndRelative) {
    const parts = pathRootAndRelative(fullPath, roots)
    if (kind === 'scan') {
      return {
        selectedSource: '',
        root: parts.root,
        rel: '',
        markManual: false,
        clearPath: true,
      }
    }
    if (kind === 'subtitles') {
      return {
        selectedSource: '',
        root: parts.root,
        rel: parts.rel,
        markManual: true,
        clearPath: false,
      }
    }
    return {
      selectedSource: fullPath,
      root: parts.root,
      rel: parts.rel,
      markManual: false,
      clearPath: false,
    }
  }

export function requireScanRow(rows, index, missingMessage) {
    const item = (rows || [])[index]
    if (!item) throw new Error(missingMessage || 'Scanned row not found')
    return item
  }

export function suggestionPreviewData(item) {
    return {
      current: item.current,
      suggested: item.suggested,
      newPath: item.newPath,
      suggestion: item.suggestion || {}
    }
  }

export function renamePreviewState(item) {
    return {
      selectedSource: item.path || '',
      suggestedName: item.suggested || '',
      renameTarget: item.newPath || '',
      preview: suggestionPreviewData(item)
    }
  }

export function movePreviewState(item) {
    return {
      selectedSource: item.path || '',
      categoryPath: item.path || ''
    }
  }

export const IndexerManageSelection = {
  selectedSourceText,
  managePathSelection,
  requireScanRow,
  suggestionPreviewData,
  renamePreviewState,
  movePreviewState,
};
