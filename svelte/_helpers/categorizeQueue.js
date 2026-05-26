import { escapeHtml } from './xFormatter.js';

  export function parseCategorizeMessage(message) {
    const raw = String(message || '')
    const out = {}
    ;['moved', 'skipped_existing', 'removed_aux', 'removed_screens', 'removed_empty_dirs'].forEach(key => {
      const m = raw.match(new RegExp(key + '=(\\d+)'))
      if (m) out[key] = Number(m[1])
    })
    return out
  }

  export function categorizeSummaryLabel(key) {
    switch (key) {
      case 'moved': return 'Moved'
      case 'skipped_existing': return 'Skipped Existing'
      case 'removed_aux': return 'Removed Aux'
      case 'removed_screens': return 'Removed Screens'
      case 'removed_empty_dirs': return 'Removed Empty Dirs'
      default: return String(key || '').replaceAll('_', ' ')
    }
  }

  export function renderManageTaskMeta(task) {
    if (!task || task.action !== 'categorize') return ''
    const bits = []
    if (task.watchedCount) bits.push('watched=' + escapeHtml(String(task.watchedCount)))
    bits.push('videosOnly=' + escapeHtml(String(!!task.videosOnly)))
    bits.push('removeEmpty=' + escapeHtml(String(!!task.removeEmptyDirs)))
    return '<div class="mono" style="margin-top:4px; color:var(--muted)">' + bits.join(' ') + '</div>'
  }

  export function categorizeKindLabel(kind) {
    switch (String(kind || '')) {
      case 'subtitle': return 'SUB'
      case 'auxiliary': return 'AUX'
      default: return 'VID'
    }
  }

  export function categorizeKindClass(kind) {
    switch (String(kind || '')) {
      case 'subtitle': return 'pillFile'
      case 'auxiliary': return 'pillFile'
      default: return 'pillDir'
    }
  }

  export function escapeJSString(text) {
    return String(text || '')
      .replaceAll('\\', '\\\\')
      .replaceAll("'", "\\'")
      .replaceAll('\n', '\\n')
  }

  export function renderManageMessage(message) {
    const raw = String(message || '')
    const summary = parseCategorizeMessage(raw)
    const keys = Object.keys(summary)
    if (!keys.length) {
      return '<div class="mono">' + escapeHtml(raw) + '</div>'
    }
    const summaryHtml = '<div class="previewList">' +
      keys.map(key =>
        '<div class="previewItem"><div class="previewLabel">' + escapeHtml(categorizeSummaryLabel(key)) + '</div><div class="mono">' + escapeHtml(String(summary[key])) + '</div></div>'
      ).join('') +
      '</div>'
    const rawTrim = raw.trim()
    const summaryOnly = /^categorize completed\b/i.test(rawTrim)
    if (summaryOnly) {
      return summaryHtml
    }
    return summaryHtml +
      '<details style="margin-top:8px">' +
        '<summary class="mono" style="color:var(--muted); cursor:pointer">Raw output</summary>' +
        '<div class="mono" style="margin-top:6px; color:var(--muted); white-space:pre-wrap">' + escapeHtml(raw) + '</div>' +
      '</details>'
  }

  export function renderManageTaskCard(label, task, isQueueSelected) {
    return '<div class="previewItem"><div class="previewLabel">' + escapeHtml(label) + '</div><div class="mono">' +
      escapeHtml(task.action || '') + ' • ' + escapeHtml(task.srcPath || '') +
      (task.dstPath ? ' → ' + escapeHtml(task.dstPath) : '') +
      '<br>' + escapeHtml(task.status || '') +
      '</div>' +
      renderManageTaskMeta(task) +
      (label === 'Queued' && task.id ? '<div class="row" style="margin:6px 0 0 0"><input type="checkbox" ' + (isQueueSelected ? 'checked ' : '') + 'onchange="toggleManageQueueSelection(\'' + escapeHtml(task.id || '') + '\', this.checked)"><button class="ghost warn" onclick="cancelManageTask(\'' + escapeHtml(task.id || '') + '\')">Cancel</button></div>' : '') +
      renderManageMessage(task.message || '') +
    '</div>'
  }

  function sortLabel(state, which, field, label) {
    const sortByKey = which === 'groups' ? 'categorizeGroupSortBy' : (which === 'ops' ? 'categorizeOpSortBy' : 'categorizeAmbiguousSortBy')
    const sortDescKey = which === 'groups' ? 'categorizeGroupSortDesc' : (which === 'ops' ? 'categorizeOpSortDesc' : 'categorizeAmbiguousSortDesc')
    if (state[sortByKey] !== field) return label
    return label + (state[sortDescKey] ? ' ↓' : ' ↑')
  }

  export function buildCategorizePreviewHtml(res, opts, state) {
    const ops = res.operations || []
    const groups = res.groups || []
    const ambiguous = res.ambiguousSubtitles || []
    const kindFilter = state.categorizeKindFilter || 'all'
    const groupFilter = state.categorizeGroupFilter || ''
    const groupTextFilter = String(state.categorizeGroupTextFilter || '').trim().toLowerCase()
    const textFilter = String(state.categorizeTextFilter || '').trim().toLowerCase()
    const ambiguousFilter = String(state.categorizeAmbiguousFilter || '').trim().toLowerCase()
    const filteredOps = ops.filter(item => {
      if (kindFilter !== 'all' && String(item.kind || '') !== kindFilter) return false
      if (groupFilter && String(item.targetDir || '') !== groupFilter) return false
      if (textFilter) {
        const hay = ((item.source || '') + ' ' + (item.target || '') + ' ' + (item.targetDir || '')).toLowerCase()
        if (!hay.includes(textFilter)) return false
      }
      return true
    })
    const filteredAmbiguous = ambiguous.filter(item => {
      if (!ambiguousFilter) return true
      const hay = ((item.video || '') + ' ' + (item.candidates || []).join(' ')).toLowerCase()
      return hay.includes(ambiguousFilter)
    })
    const visibleGroups = groups.filter(group => {
      if (groupFilter && String(group.targetDir || '') !== groupFilter) return false
      if (groupTextFilter) {
        const hay = String(group.targetDir || '').toLowerCase()
        if (!hay.includes(groupTextFilter)) return false
      }
      return true
    })
    const sortedGroups = [...visibleGroups].sort((a, b) => {
      const field = state.categorizeGroupSortBy || 'targetDir'
      const desc = !!state.categorizeGroupSortDesc
      const av = field === 'count' ? (a.count || 0) : field === 'videoMoves' ? (a.videoMoves || 0) : field === 'subtitleMoves' ? (a.subtitleMoves || 0) : field === 'auxiliaryMoves' ? (a.auxiliaryMoves || 0) : String(a.targetDir || '')
      const bv = field === 'count' ? (b.count || 0) : field === 'videoMoves' ? (b.videoMoves || 0) : field === 'subtitleMoves' ? (b.subtitleMoves || 0) : field === 'auxiliaryMoves' ? (b.auxiliaryMoves || 0) : String(b.targetDir || '')
      if (av < bv) return desc ? 1 : -1
      if (av > bv) return desc ? -1 : 1
      return String(a.targetDir || '').localeCompare(String(b.targetDir || ''))
    })
    const sortedFilteredOps = [...filteredOps].sort((a, b) => {
      const field = state.categorizeOpSortBy || 'target'
      const desc = !!state.categorizeOpSortDesc
      const av = String(field === 'kind' ? (a.kind || '') : field === 'source' ? (a.source || '') : (a.target || ''))
      const bv = String(field === 'kind' ? (b.kind || '') : field === 'source' ? (b.source || '') : (b.target || ''))
      if (av < bv) return desc ? 1 : -1
      if (av > bv) return desc ? -1 : 1
      return String(a.target || '').localeCompare(String(b.target || ''))
    })
    const sortedFilteredAmbiguous = [...filteredAmbiguous].sort((a, b) => {
      const field = state.categorizeAmbiguousSortBy || 'video'
      const desc = !!state.categorizeAmbiguousSortDesc
      const av = String(field === 'candidates' ? (a.candidates || []).join(', ') : (a.video || ''))
      const bv = String(field === 'candidates' ? (b.candidates || []).join(', ') : (b.video || ''))
      if (av < bv) return desc ? 1 : -1
      if (av > bv) return desc ? -1 : 1
      return String(a.video || '').localeCompare(String(b.video || ''))
    })
    const kindButtons = [
      ['all', 'ALL'],
      ['video', 'VID'],
      ['subtitle', 'SUB'],
      ['auxiliary', 'AUX'],
    ].map(([value, label]) =>
      '<button class="' + (kindFilter === value ? '' : 'ghost') + '" onclick="setCategorizeKindFilter(\'' + value + '\')">' + label + '</button>'
    ).join('')
    const activeFilters = []
    if (kindFilter !== 'all') activeFilters.push('kind=' + kindFilter)
    if (groupFilter) activeFilters.push('group=' + groupFilter)
    if (groupTextFilter) activeFilters.push('groups=' + groupTextFilter)
    if (textFilter) activeFilters.push('ops=' + textFilter)
    if (ambiguousFilter) activeFilters.push('ambiguous=' + ambiguousFilter)
    const warnings = []
    if (res.truncated) warnings.push('preview truncated')
    if (ambiguous.length) warnings.push('ambiguous subtitles: ' + ambiguous.length)
    return '<div class="previewLabel">Categorize Preview</div>' +
      '<div class="previewList">' +
        '<div class="previewItem"><div class="previewLabel">Detected Videos</div><div class="mono">' + escapeHtml(String(res.detectedVideoFiles || 0)) + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Detected Groups</div><div class="mono">' + escapeHtml(String(res.detectedGroups || 0)) + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Planned Moves</div><div class="mono">' + escapeHtml(String(res.plannedMoves || 0)) + (res.truncated ? ' (truncated)' : '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Video / Subtitle / Aux</div><div class="mono">' + escapeHtml(String(res.videoMoves || 0)) + ' / ' + escapeHtml(String(res.subtitleMoves || 0)) + ' / ' + escapeHtml(String(res.auxiliaryMoves || 0)) + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Watched Count / Videos Only</div><div class="mono">' + escapeHtml(String(opts.watchedCount)) + ' / ' + escapeHtml(String(!!opts.videosOnly)) + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Warnings</div><div class="mono">' + (warnings.length ? escapeHtml(warnings.join(' | ')) : 'none') + '</div></div>' +
      '</div>' +
      '<div class="row" style="margin:0 0 12px 0"><button onclick="queueCategorize()">Queue Categorize Apply</button><button class="ghost" onclick="copyCategorizeCurrentView()">Copy Current View</button><button class="ghost" onclick="copyCategorizeFilteredOperations()">Copy Filtered Ops</button><button class="ghost" onclick="resetCategorizeFilters()">Reset Filters</button></div>' +
      '<div class="previewBox mono" style="margin-bottom:12px; min-height:auto; padding:8px 10px">' + (activeFilters.length ? ('Active Filters: ' + escapeHtml(activeFilters.join(' | '))) : 'Active Filters: none') + '</div>' +
      '<div class="resultPane" style="margin-bottom:12px"><div class="resultHeader"><h2>Target Groups</h2><div class="row" style="margin:0"><div class="mono" style="color:var(--muted)">' + visibleGroups.length + ' / ' + groups.length + ' groups</div><button class="ghost" onclick="copyCategorizeFilteredGroups()">Copy Filtered</button>' + (groupFilter ? '<button class="ghost" onclick="setCategorizeGroupFilter(\'\')">Clear Group</button>' : '') + '</div></div><div class="row" style="margin:0 0 10px 0"><input value="' + escapeHtml(state.categorizeGroupTextFilter || '') + '" oninput="setCategorizeGroupTextFilter(this.value)" placeholder="Filter groups by target folder"><button class="ghost" onclick="setCategorizeGroupTextFilter(\'\')">Clear</button></div><div class="resultScroll" style="max-height:220px"><table><thead><tr><th class="clickable" onclick="toggleCategorizeSort(\'groups\', \'targetDir\')" style="width:44%">' + sortLabel(state, 'groups', 'targetDir', 'Target Folder') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'groups\', \'count\')" style="width:10%">' + sortLabel(state, 'groups', 'count', 'Items') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'groups\', \'videoMoves\')" style="width:10%">' + sortLabel(state, 'groups', 'videoMoves', 'VID') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'groups\', \'subtitleMoves\')" style="width:10%">' + sortLabel(state, 'groups', 'subtitleMoves', 'SUB') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'groups\', \'auxiliaryMoves\')" style="width:10%">' + sortLabel(state, 'groups', 'auxiliaryMoves', 'AUX') + '</th><th style="width:16%">Action</th></tr></thead><tbody>' +
      (sortedGroups.length ? sortedGroups.map(group =>
        '<tr class="clickable" onclick="setCategorizeGroupFilter(\'' + escapeJSString(group.targetDir || '') + '\')"><td class="mono"><span class="cellEllipsis" title="' + escapeHtml(group.targetDir || '') + '">' + escapeHtml(group.targetDir || '') + '</span>' + (groupFilter === String(group.targetDir || '') ? ' <span class="pill pillDir">FILTER</span>' : '') + '</td><td class="mono">' + escapeHtml(String(group.count || 0)) + '</td><td class="mono">' + escapeHtml(String(group.videoMoves || 0)) + '</td><td class="mono">' + escapeHtml(String(group.subtitleMoves || 0)) + '</td><td class="mono">' + escapeHtml(String(group.auxiliaryMoves || 0)) + '</td><td><div class="row" style="margin:0"><button class="ghost iconBtn" title="Copy folder" onclick="copyPlainText(\'' + escapeJSString(group.targetDir || '') + '\', event)">⧉F</button><button class="ghost iconBtn" title="Filter this folder" onclick="setCategorizeGroupFilter(\'' + escapeJSString(group.targetDir || '') + '\'); event.stopPropagation()">↗</button></div></td></tr>'
      ).join('') : '<tr><td colspan="6" class="empty">No target folders for the current filters</td></tr>') +
      '</tbody></table></div></div>' +
      '<div class="resultPane" style="margin-bottom:12px"><div class="resultHeader"><h2>Planned Operations</h2><div class="row" style="margin:0"><div class="mono" style="color:var(--muted)">' + filteredOps.length + ' / ' + ops.length + ' rows</div>' + kindButtons + '</div></div><div class="row" style="margin:0 0 10px 0"><input value="' + escapeHtml(state.categorizeTextFilter || '') + '" oninput="setCategorizeTextFilter(this.value)" placeholder="Filter operations by source, target, or folder"><button class="ghost" onclick="setCategorizeTextFilter(\'\')">Clear</button></div><div class="resultScroll" style="max-height:280px"><table><thead><tr><th class="clickable" onclick="toggleCategorizeSort(\'ops\', \'kind\')" style="width:10%">' + sortLabel(state, 'ops', 'kind', 'Kind') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'ops\', \'source\')" style="width:31%">' + sortLabel(state, 'ops', 'source', 'Source') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'ops\', \'target\')" style="width:31%">' + sortLabel(state, 'ops', 'target', 'Target') + '</th><th style="width:28%">Action</th></tr></thead><tbody>' +
      (sortedFilteredOps.length ? sortedFilteredOps.map(item =>
        '<tr><td><button class="ghost pill ' + categorizeKindClass(item.kind) + '" title="Filter this kind" onclick="setCategorizeKindFilter(\'' + escapeJSString(item.kind || 'all') + '\'); event.stopPropagation()">' + escapeHtml(categorizeKindLabel(item.kind)) + '</button></td><td class="mono"><span class="cellEllipsis" title="' + escapeHtml(item.source || '') + '">' + escapeHtml(item.source || '') + '</span></td><td class="mono"><span class="cellEllipsis" title="' + escapeHtml(item.target || '') + '">' + escapeHtml(item.target || '') + '</span></td><td><div class="row" style="margin:0"><button class="ghost iconBtn" title="Copy source" onclick="copyPlainText(\'' + escapeJSString(item.source || '') + '\', event)">⧉S</button><button class="ghost iconBtn" title="Copy target" onclick="copyPlainText(\'' + escapeJSString(item.target || '') + '\', event)">⧉T</button><button class="ghost iconBtn" title="Filter target folder" onclick="setCategorizeGroupFilter(\'' + escapeJSString(item.targetDir || '') + '\'); event.stopPropagation()">↗G</button></div></td></tr>'
      ).join('') : '<tr><td colspan="4" class="empty">No planned operations for the current filters</td></tr>') +
      '</tbody></table></div></div>' +
      (ambiguous.length ? '<div class="resultPane" style="margin-bottom:12px"><div class="resultHeader"><h2>Ambiguous Subtitles Skipped</h2><div class="row" style="margin:0"><div class="mono" style="color:var(--muted)">' + filteredAmbiguous.length + ' / ' + ambiguous.length + ' rows</div><button class="ghost" onclick="copyCategorizeFilteredAmbiguous()">Copy Filtered</button></div></div><div class="row" style="margin:0 0 10px 0"><input value="' + escapeHtml(state.categorizeAmbiguousFilter || '') + '" oninput="setCategorizeAmbiguousFilter(this.value)" placeholder="Filter ambiguous subtitles by video or candidate"><button class="ghost" onclick="setCategorizeAmbiguousFilter(\'\')">Clear</button></div><div class="resultScroll" style="max-height:220px"><table><thead><tr><th class="clickable" onclick="toggleCategorizeSort(\'ambiguous\', \'video\')" style="width:28%">' + sortLabel(state, 'ambiguous', 'video', 'Video') + '</th><th class="clickable" onclick="toggleCategorizeSort(\'ambiguous\', \'candidates\')" style="width:54%">' + sortLabel(state, 'ambiguous', 'candidates', 'Candidates') + '</th><th style="width:18%">Action</th></tr></thead><tbody>' +
      (sortedFilteredAmbiguous.length ? sortedFilteredAmbiguous.map(item =>
        '<tr><td class="mono"><span class="cellEllipsis" title="' + escapeHtml(item.video || '') + '">' + escapeHtml(item.video || '') + '</span></td><td class="mono"><span class="cellEllipsis" title="' + escapeHtml((item.candidates || []).join(', ')) + '">' + escapeHtml((item.candidates || []).join(', ')) + '</span></td><td><div class="row" style="margin:0"><button class="ghost iconBtn" title="Copy video" onclick="copyPlainText(\'' + escapeJSString(item.video || '') + '\', event)">⧉V</button><button class="ghost iconBtn" title="Copy candidates" onclick="copyPlainText(\'' + escapeJSString((item.candidates || []).join(', ')) + '\', event)">⧉C</button></div></td></tr>'
      ).join('') : '<tr><td colspan="3" class="empty">No ambiguous subtitle rows for the current filter</td></tr>') + '</tbody></table></div></div>' : '') +
      '<details class="previewBox" style="min-height:auto; padding:10px 12px"><summary class="mono" style="cursor:pointer">Raw Script Output</summary><div class="row" style="margin:10px 0"><button class="ghost" onclick="copyPlainText(\'' + escapeJSString(res.output || '') + '\', event)">Copy Raw Output</button></div><div class="statusBox" style="min-height:140px; max-height:320px; margin-top:0">' + escapeHtml(res.output || '') + '</div></details>'
  }

export const IndexerCategorizeQueue = {
  parseCategorizeMessage,
  categorizeSummaryLabel,
  renderManageTaskMeta,
  categorizeKindLabel,
  categorizeKindClass,
  escapeJSString,
  renderManageMessage,
  renderManageTaskCard,
  buildCategorizePreviewHtml,
};
