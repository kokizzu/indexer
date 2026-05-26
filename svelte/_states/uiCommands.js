function emit(name, detail = {}) {
  if (typeof window === 'undefined' || !window.dispatchEvent) return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function requestSwitchTab(tab) {
  emit('indexer:uiCommand', { scope: 'tab', tab });
}

export function requestSwitchManageTab(tab) {
  emit('indexer:uiCommand', { scope: 'manageTab', tab });
}

export function requestManageAction(action, detail = {}) {
  emit('indexer:uiCommand', { scope: 'manageAction', action, ...detail });
}

export function requestManageFormPatch(patch = {}) {
  emit('indexer:manageForm', { patch });
}
