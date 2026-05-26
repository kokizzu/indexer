import { writable } from 'svelte/store';

export const manageTab = writable('suggest');

export function setManageTab(tab) {
  manageTab.set(tab || 'suggest');
}

export function bindManageTab(windowRef) {
  const handler = event => {
    setManageTab(event?.detail?.tab || 'suggest');
  };
  windowRef?.addEventListener?.('indexer:manageTab', handler);
  return () => windowRef?.removeEventListener?.('indexer:manageTab', handler);
}
