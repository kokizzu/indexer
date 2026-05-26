import { IndexerApi as api } from '../jsApi.GEN.js';

export async function suggestRename(ctx) {
  const { state, showToast, getJSON, renderSuggestionCards, applySuggestionPreview, doc } = ctx;
  const path = state.selectedSource || '';
  if (!path) {
    showToast('Source path is required');
    return;
  }
  const res = await getJSON(api.suggest, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
  applySuggestionPreview(doc, renderSuggestionCards, res, 'Rename Suggestion');
}

export async function previewCategorize(ctx) {
  const { state, showToast, categorizeOptionsFromUI, postJSON, getJSON, resetCategorizePreviewState, renderCategorizePreview } = ctx;
  const path = state.selectedSource || '';
  if (!path) {
    showToast('Directory path is required');
    return;
  }
  const opts = categorizeOptionsFromUI();
  const res = await postJSON(getJSON, api.categorizePreview, {
    path,
    previewLimit: 120,
    videosOnly: opts.videosOnly,
    watchedCount: opts.watchedCount,
  });
  resetCategorizePreviewState(state, res, opts);
  renderCategorizePreview(res, opts);
}

export async function queueCategorize(ctx) {
  const { state, showToast, promptFn, categorizeOptionsFromUI, postJSON, getJSON, setManageResult, doc, refreshManageQueue, refreshManageHistory } = ctx;
  const path = state.selectedSource || '';
  if (!path) {
    showToast('Directory path is required');
    return;
  }
  const password = promptFn('Manage password?') || '';
  if (!password) {
    showToast('Password is required to queue categorize apply');
    return;
  }
  const opts = categorizeOptionsFromUI();
  const res = await postJSON(getJSON, api.manageQueue, {
    action: 'categorize',
    password,
    srcPath: path,
    videosOnly: opts.videosOnly,
    watchedCount: opts.watchedCount,
    removeEmptyDirs: opts.removeEmptyDirs,
  });
  setManageResult(doc, res);
  showToast('Categorize apply queued');
  refreshManageQueue();
  refreshManageHistory();
}

export async function suggestRenameFromRenameTab(ctx) {
  const { state, showToast, postJSON, getJSON, syncManageFormState, doc, applySuggestionPreview, renderSuggestionCards } = ctx;
  const path = state.selectedSource || '';
  if (!path) {
    showToast('Directory path is required');
    return;
  }
  const res = await postJSON(getJSON, api.suggest, { path });
  syncManageFormState({
    suggestedName: res.suggested || '',
    renameTarget: res.newPath || '',
  });
  const target = doc.getElementById('manageRenameTarget');
  if (target) delete target.dataset.manual;
  applySuggestionPreview(doc, renderSuggestionCards, res, 'Rename Suggestion');
}

export async function suggestSubtitleRenameFromRenameTab(ctx) {
  const { state, showToast, postJSON, getJSON, syncManageFormState, doc, applySubtitleSuggestionPreview, renderSubtitleSuggestionHtml } = ctx;
  const path = state.selectedSource || '';
  if (!path) {
    showToast('Subtitle path is required');
    return;
  }
  const res = await postJSON(getJSON, api.suggestSubtitle, { path });
  syncManageFormState({
    suggestedName: res.suggested || '',
    renameTarget: res.newPath || '',
  });
  const target = doc.getElementById('manageRenameTarget');
  if (target) delete target.dataset.manual;
  applySubtitleSuggestionPreview(doc, renderSubtitleSuggestionHtml, res, path);
}

export function buildManagePlan(ctx) {
  const { state, formState, buildManagePlanImpl, action } = ctx;
  return buildManagePlanImpl(action, {
    path: state.selectedSource || '',
    newPath: String(formState.renameTarget || '').trim(),
    dstRoot: String(formState.dstRoot || '').trim(),
    dstSubdir: String(formState.dstSubdir || '').trim().replace(/^\/+/, '').replace(/\/+$/, ''),
  });
}

export function renderManagePlan(ctx) {
  const { doc, plan, applyManagePreview, renderManagePlanHtml } = ctx;
  applyManagePreview(doc, renderManagePlanHtml(plan));
}

export function renderManageModal(ctx) {
  const { doc, plan, applyManageModal, renderManageModalBodyHtml } = ctx;
  applyManageModal(doc, plan, renderManageModalBodyHtml(plan));
}

export function closeManageModal(ctx) {
  const { doc, event, closeManageModalView } = ctx;
  return closeManageModalView(doc, event);
}

export function categorizeOptionsFromUI(ctx) {
  const { formState, categorizeOptionsFromState } = ctx;
  return categorizeOptionsFromState(formState);
}

export function previewManage(ctx) {
  const { action, state, buildManagePlan, renderManagePlan, renderManageModal, showToast } = ctx;
  try {
    const plan = buildManagePlan(action);
    state.plan = plan;
    renderManagePlan(plan);
    renderManageModal(plan);
  } catch (err) {
    showToast(err.message || String(err));
  }
}

export async function confirmManage(ctx) {
  const { state, showToast, promptFn, queueBodyFromPlan, postJSON, getJSON, setManageResult, doc, closeManageModal, refreshManageQueue, refreshManageHistory } = ctx;
  if (!state.plan) {
    showToast('Nothing to confirm');
    return;
  }
  try {
    const password = promptFn('Manage password?') || '';
    if (!password) {
      showToast('Password is required to queue this action');
      return;
    }
    const queueBody = queueBodyFromPlan(state.plan, password);
    const res = await postJSON(getJSON, api.manageQueue, queueBody);
    setManageResult(doc, res);
    closeManageModal();
    showToast('Manage action queued');
    refreshManageQueue();
    refreshManageHistory();
  } catch (err) {
    setManageResult(doc, String(err));
  }
}

export async function copyPlainText(ctx) {
  const { text, event, copyPlainTextHelper, navigatorRef, showToast } = ctx;
  if (event) event.stopPropagation();
  try {
    await copyPlainTextHelper(text, navigatorRef);
    showToast('Copied text');
  } catch (err) {
    showToast('Copy failed: ' + err);
  }
}

export async function copyCategorizeFilteredOperations(ctx) {
  const { state, hasCategorizePreview, showToast, buildCategorizeOperationsText, categorizeKindLabel, copyPlainText } = ctx;
  if (!hasCategorizePreview(state)) {
    showToast('No categorize preview available');
    return;
  }
  const text = buildCategorizeOperationsText(state, categorizeKindLabel);
  if (!text) {
    showToast('No filtered operations to copy');
    return;
  }
  await copyPlainText(text);
}

export async function copyCategorizeFilteredAmbiguous(ctx) {
  const { state, hasCategorizePreview, showToast, buildCategorizeAmbiguousText, copyPlainText } = ctx;
  if (!hasCategorizePreview(state)) {
    showToast('No categorize preview available');
    return;
  }
  const text = buildCategorizeAmbiguousText(state);
  if (!text) {
    showToast('No filtered ambiguous rows to copy');
    return;
  }
  await copyPlainText(text);
}

export async function copyCategorizeFilteredGroups(ctx) {
  const { state, hasCategorizePreview, showToast, buildCategorizeGroupsText, copyPlainText } = ctx;
  if (!hasCategorizePreview(state)) {
    showToast('No categorize preview available');
    return;
  }
  const text = buildCategorizeGroupsText(state);
  if (!text) {
    showToast('No filtered groups to copy');
    return;
  }
  await copyPlainText(text);
}

export async function copyCategorizeCurrentView(ctx) {
  const { state, hasCategorizePreview, showToast, buildCategorizeCurrentViewText, categorizeKindLabel, copyPlainText } = ctx;
  if (!hasCategorizePreview(state)) {
    showToast('No categorize preview available');
    return;
  }
  await copyPlainText(buildCategorizeCurrentViewText(state, categorizeKindLabel));
}

export function setCategorizeFilter(ctx) {
  const { state, patch, applyCategorizeFilter, setFilterAndRerender, renderStoredCategorizePreview } = ctx;
  setFilterAndRerender(state, patch, applyCategorizeFilter, renderStoredCategorizePreview);
}

export function resetCategorizeFilters(ctx) {
  const { state, applyCategorizeFilter, setFilterAndRerender, renderStoredCategorizePreview } = ctx;
  setFilterAndRerender(state, {
    categorizeKindFilter: 'all',
    categorizeGroupFilter: '',
    categorizeTextFilter: '',
    categorizeAmbiguousFilter: '',
    categorizeGroupTextFilter: '',
  }, applyCategorizeFilter, renderStoredCategorizePreview);
}

export function toggleCategorizeSort(ctx) {
  const { state, which, field, toggleCategorizeSortState, renderStoredCategorizePreview } = ctx;
  toggleCategorizeSortState(state, which, field);
  renderStoredCategorizePreview();
}

export function renderStoredCategorizePreview(ctx) {
  const { state, renderCategorizePreview } = ctx;
  if (!state.categorizePreview) return;
  renderCategorizePreview(state.categorizePreview.res, state.categorizePreview.opts);
}

export function renderCategorizePreview(ctx) {
  const { doc, res, opts, state, buildCategorizePreviewHtml } = ctx;
  doc.defaultView?.dispatchEvent?.(new CustomEvent('indexer:managePreview', {
    detail: {
      kind: 'preview',
      previewHtml: buildCategorizePreviewHtml(res, opts, state),
    },
  }));
}
