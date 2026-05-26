import { writable } from 'svelte/store';

const initialState = {
  active: false,
  title: 'Confirm Change',
  subtitle: '',
  bodyHtml: '',
};

export const manageModal = writable(initialState);

export function setManageModalState(next) {
  manageModal.set({
    ...initialState,
    ...next,
    active: !!next?.active,
  });
}

export function bindManageModal(windowRef) {
  const handler = event => {
    const detail = event?.detail || {};
    setManageModalState({
      active: !!detail.open,
      title: detail.title || initialState.title,
      subtitle: detail.subtitle || '',
      bodyHtml: detail.bodyHtml || '',
    });
  };
  windowRef?.addEventListener?.('indexer:manageModal', handler);
  return () => windowRef?.removeEventListener?.('indexer:manageModal', handler);
}
