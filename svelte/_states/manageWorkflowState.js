import { writable } from 'svelte/store';

const initialState = {
  tab: 'suggest',
  scanConfig: {
    title: 'Step 2: Scan Suggest Candidates',
    button: 'Scan Suggest Candidates',
    empty: 'No suggestion candidates found in this scan path',
  },
  scanRows: [],
  selectedScanRows: [],
  subtitleRows: [],
};

export const manageWorkflowState = writable(initialState);

export function bindManageWorkflowState(windowRef) {
  const handler = event => {
    const detail = event?.detail || {};
    manageWorkflowState.update(current => ({
      ...current,
      ...detail,
      scanConfig: detail.scanConfig || current.scanConfig,
      scanRows: detail.scanRows || current.scanRows,
      selectedScanRows: detail.selectedScanRows || current.selectedScanRows,
      subtitleRows: detail.subtitleRows || current.subtitleRows,
      tab: detail.tab || current.tab,
    }));
  };
  windowRef?.addEventListener?.('indexer:manageWorkflow', handler);
  return () => windowRef?.removeEventListener?.('indexer:manageWorkflow', handler);
}
