import { writable } from 'svelte/store';

const initialState = {
  roots: [],
  selectedPath: '',
};

export const browseBridgeState = writable(initialState);

export function bindBrowseBridgeState(windowRef) {
  const handler = event => {
    const detail = event?.detail || {};
    browseBridgeState.update(current => ({
      ...current,
      roots: detail.roots || current.roots,
      selectedPath: detail.selectedPath || current.selectedPath,
    }));
  };
  windowRef?.addEventListener?.('indexer:browseState', handler);
  return () => windowRef?.removeEventListener?.('indexer:browseState', handler);
}
