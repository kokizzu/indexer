import { writable } from 'svelte/store';

const initialState = {
  title: 'Step 3: Name Fix Preview / Queue',
  selectedSource: '',
  previewHtml: 'Fill the flow above, then click <strong>Preview</strong>.',
  locked: false,
  resultText: '',
};

export const managePreview = writable(initialState);

function stringifyResult(value) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

export function bindManagePreview(windowRef) {
  const previewHandler = event => {
    const detail = event?.detail || {};
    managePreview.update(current => {
      if (detail.kind === 'unlock') {
        return { ...current, locked: false };
      }
      if (detail.kind === 'meta') {
        return {
          ...current,
          title: detail.title || current.title,
          previewHtml: current.locked ? current.previewHtml : (detail.previewHtml || current.previewHtml),
        };
      }
      if (detail.kind === 'preview') {
        return {
          ...current,
          previewHtml: detail.previewHtml || '',
          locked: true,
        };
      }
      if (detail.kind === 'selectedSource') {
        return {
          ...current,
          selectedSource: detail.selectedSource || '',
        };
      }
      return current;
    });
  };
  const resultHandler = event => {
    const detail = event?.detail || {};
    managePreview.update(current => ({
      ...current,
      resultText: stringifyResult(detail.value),
    }));
  };
  windowRef?.addEventListener?.('indexer:managePreview', previewHandler);
  windowRef?.addEventListener?.('indexer:manageResult', resultHandler);
  return () => {
    windowRef?.removeEventListener?.('indexer:managePreview', previewHandler);
    windowRef?.removeEventListener?.('indexer:manageResult', resultHandler);
  };
}
