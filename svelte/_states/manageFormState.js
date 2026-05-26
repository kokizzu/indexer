import { writable } from 'svelte/store';

const initialState = {
  scanRoot: '',
  scanPath: '',
  subtitleRoot: '',
  subtitlePath: '',
  suggestedName: '',
  renameTarget: '',
  dstRoot: '',
  dstSubdir: '',
  categorizeWatched: 0,
  categorizeVideosOnly: false,
  categorizeRemoveEmpty: true,
};

export const manageFormState = writable(initialState);

export function bindManageFormState(windowRef) {
  const handler = event => {
    const patch = event?.detail?.patch || {};
    manageFormState.update(current => ({
      ...current,
      ...patch,
    }));
  };
  windowRef?.addEventListener?.('indexer:manageForm', handler);
  return () => windowRef?.removeEventListener?.('indexer:manageForm', handler);
}
