export function toggleSelection(current, id, checked) {
    const next = new Set(current || [])
    if (checked) next.add(id)
    else next.delete(id)
    return Array.from(next)
  }

export function hasSelection(current, id) {
    return !!id && (current || []).includes(id)
  }

export function filteredCategorizeOperations(state) {
    const preview = state.categorizePreview || {}
    const ops = preview.res?.operations || []
    const kindFilter = state.categorizeKindFilter || 'all'
    const groupFilter = String(state.categorizeGroupFilter || '')
    const textFilter = String(state.categorizeTextFilter || '').trim().toLowerCase()
    return ops.filter(item => {
      if (kindFilter !== 'all' && String(item.kind || '') !== kindFilter) return false
      if (groupFilter && String(item.targetDir || '') !== groupFilter) return false
      if (textFilter) {
        const hay = ((item.source || '') + ' ' + (item.target || '') + ' ' + (item.targetDir || '')).toLowerCase()
        if (!hay.includes(textFilter)) return false
      }
      return true
    })
  }

export function filteredCategorizeGroups(state) {
    const preview = state.categorizePreview || {}
    const groups = preview.res?.groups || []
    const groupFilter = String(state.categorizeGroupFilter || '')
    const groupTextFilter = String(state.categorizeGroupTextFilter || '').trim().toLowerCase()
    return groups.filter(group => {
      if (groupFilter && String(group.targetDir || '') !== groupFilter) return false
      if (groupTextFilter) {
        const hay = String(group.targetDir || '').toLowerCase()
        if (!hay.includes(groupTextFilter)) return false
      }
      return true
    })
  }

export function filteredCategorizeAmbiguous(state) {
    const preview = state.categorizePreview || {}
    const ambiguous = preview.res?.ambiguousSubtitles || []
    const ambiguousFilter = String(state.categorizeAmbiguousFilter || '').trim().toLowerCase()
    return ambiguous.filter(item => {
      if (!ambiguousFilter) return true
      const hay = ((item.video || '') + ' ' + (item.candidates || []).join(' ')).toLowerCase()
      return hay.includes(ambiguousFilter)
    })
  }

export function buildCategorizeOperationsText(state, labelForKind) {
    return filteredCategorizeOperations(state).map(item =>
      '[' + labelForKind(item.kind) + '] ' + (item.source || '') + ' -> ' + (item.target || '')
    ).join('\n')
  }

export function buildCategorizeGroupsText(state) {
    return filteredCategorizeGroups(state).map(group =>
      (group.targetDir || '') + ' | items=' + (group.count || 0) + ' vid=' + (group.videoMoves || 0) + ' sub=' + (group.subtitleMoves || 0) + ' aux=' + (group.auxiliaryMoves || 0)
    ).join('\n')
  }

export function buildCategorizeAmbiguousText(state) {
    return filteredCategorizeAmbiguous(state).map(item =>
      (item.video || '') + ' :: ' + (item.candidates || []).join(', ')
    ).join('\n')
  }

export function buildCategorizeCurrentViewText(state, labelForKind) {
    const res = state.categorizePreview?.res || {}
    const opts = state.categorizePreview?.opts || {}
    const filteredGroups = filteredCategorizeGroups(state)
    const filteredOps = filteredCategorizeOperations(state)
    const filteredAmbiguous = filteredCategorizeAmbiguous(state)
    return [
      'Categorize Preview',
      'Detected Videos: ' + String(res.detectedVideoFiles || 0),
      'Detected Groups: ' + String(res.detectedGroups || 0),
      'Planned Moves: ' + String(res.plannedMoves || 0) + (res.truncated ? ' (truncated)' : ''),
      'Video / Subtitle / Aux: ' + String(res.videoMoves || 0) + ' / ' + String(res.subtitleMoves || 0) + ' / ' + String(res.auxiliaryMoves || 0),
      'Watched Count / Videos Only: ' + String(opts.watchedCount || 0) + ' / ' + String(!!opts.videosOnly),
      'Filters: kind=' + (state.categorizeKindFilter || 'all') + ' group=' + (state.categorizeGroupFilter || '-') + ' groups=' + (state.categorizeGroupTextFilter || '-') + ' ops=' + (state.categorizeTextFilter || '-') + ' ambiguous=' + (state.categorizeAmbiguousFilter || '-'),
      '',
      'Target Groups:',
      ...filteredGroups.map(group => (group.targetDir || '') + ' | items=' + (group.count || 0) + ' vid=' + (group.videoMoves || 0) + ' sub=' + (group.subtitleMoves || 0) + ' aux=' + (group.auxiliaryMoves || 0)),
      '',
      'Planned Operations:',
      ...filteredOps.map(item => '[' + labelForKind(item.kind) + '] ' + (item.source || '') + ' -> ' + (item.target || '')),
      '',
      'Ambiguous Subtitles:',
      ...filteredAmbiguous.map(item => (item.video || '') + ' :: ' + (item.candidates || []).join(', ')),
    ].join('\n')
  }

export const IndexerManageState = {
  toggleSelection,
  hasSelection,
  filteredCategorizeOperations,
  filteredCategorizeGroups,
  filteredCategorizeAmbiguous,
  buildCategorizeOperationsText,
  buildCategorizeGroupsText,
  buildCategorizeAmbiguousText,
  buildCategorizeCurrentViewText,
};
