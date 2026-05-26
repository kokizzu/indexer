import { writable } from 'svelte/store';

export const activeTab = writable('browse');

export function restoreActiveTab(storage) {
  try {
    return storage?.getItem('indexer.activeTab') || 'browse';
  } catch (_) {
    return 'browse';
  }
}

export function setActiveTab(tab, storage) {
  activeTab.set(tab || 'browse');
  try {
    storage?.setItem('indexer.activeTab', tab || 'browse');
  } catch (_) {}
}

export function bindActiveTab(windowRef, storage) {
  const initial = restoreActiveTab(storage);
  activeTab.set(initial);
  const handler = event => {
    const tab = event?.detail?.tab || 'browse';
    setActiveTab(tab, storage);
  };
  windowRef?.addEventListener?.('indexer:tab', handler);
  return () => windowRef?.removeEventListener?.('indexer:tab', handler);
}
