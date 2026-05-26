<script>
  import { onMount } from 'svelte';
  import { bindBrowseBridgeState, browseBridgeState } from '../_states/browseBridgeState.js';
  import { bindManageFormState, manageFormState } from '../_states/manageFormState.js';
  import { manageTab } from '../_states/manageTab.js';
  import { bindManageWorkflowState, manageWorkflowState } from '../_states/manageWorkflowState.js';
  import { requestManageAction, requestManageFormPatch } from '../_states/uiCommands.js';

  let cleanup = () => {};
  let cleanupForm = () => {};
  let cleanupBrowse = () => {};

  onMount(() => {
    cleanup = bindManageWorkflowState(window);
    cleanupForm = bindManageFormState(window);
    cleanupBrowse = bindBrowseBridgeState(window);
    return () => {
      cleanup();
      cleanupForm();
      cleanupBrowse();
    };
  });

  function rowAction(tab, idx) {
    if (tab === 'suggest') return () => requestManageAction('previewScannedSuggest', { index: idx });
    if (tab === 'rename') return () => requestManageAction('previewScannedRename', { index: idx });
    if (tab === 'move') return () => requestManageAction('previewScannedMove', { index: idx });
    return () => requestManageAction('previewScannedDelete', { index: idx });
  }

  function secondaryAction(tab, idx) {
    if (tab === 'suggest') return () => requestManageAction('previewScannedCategorize', { index: idx });
    return null;
  }

  function secondaryLabel(tab) {
    return tab === 'suggest' ? 'Categorize' : '';
  }

  function batchLabel(tab) {
    if (tab === 'suggest') return 'Queue Categorize Selected';
    if (tab === 'rename') return 'Queue Rename Selected';
    if (tab === 'move') return 'Queue Move Selected';
    return 'Queue Delete Selected';
  }

  function batchAction(tab) {
    if (tab === 'suggest') return 'queueSelectedCategorize';
    if (tab === 'rename') return 'queueSelectedRenames';
    if (tab === 'move') return 'queueSelectedMoves';
    return 'queueSelectedDeletes';
  }

  function statusLabel(tab, item) {
    return item?.statusLabel || (tab === 'delete' ? 'TARGET' : '');
  }

  function rootLabel(root) {
    if (!root) return '';
    return root.base && root.base !== root.path ? `${root.base} · ${root.path}` : (root.path || '');
  }

  function showInBrowse(path, isDir, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    requestManageAction('showInBrowse', { path, isDir });
  }
</script>

<div class="resultPane" style="margin-bottom:16px">
  <div class="resultHeader">
    <h2 id="manageScanTitle">{$manageWorkflowState.scanConfig.title}</h2>
    <div id="manageScanCount" class="mono" style="color:var(--muted)">{$manageWorkflowState.scanRows.length} rows</div>
  </div>
  <div class="field">
    <label for="manageScanRoot">Scan Root</label>
    <select id="manageScanRoot" value={$manageFormState.scanRoot} onchange={(event) => requestManageFormPatch({ scanRoot: event.currentTarget.value })}>
      {#each $browseBridgeState.roots as root}
        <option value={root.path}>{rootLabel(root)}</option>
      {/each}
    </select>
  </div>
  <div class="field">
    <label for="manageScanPath">Optional Subdirectory</label>
    <input id="manageScanPath" value={$manageFormState.scanPath} placeholder="Leave empty to scan the whole selected root" oninput={(event) => { event.currentTarget.dataset.manual = event.currentTarget.value.trim() ? '1' : ''; requestManageFormPatch({ scanPath: event.currentTarget.value }); }}>
  </div>
  <div class="row" style="margin-top:14px">
    <button id="manageScanBtn" class="secondary" onclick={() => requestManageAction('runManageModeScan')}>{$manageWorkflowState.scanConfig.button}</button>
    <button class="ghost" onclick={() => requestManageAction('prefillManageFromBrowse', { kind: 'scan' })}>Use Current Browse Path</button>
  </div>
  <div id="manageBatchActions" class="row" style="margin-top:12px">
    <div class="mono" style="color:var(--muted); align-self:center">{$manageWorkflowState.selectedScanRows.length} selected</div>
    <button class:warn={$manageTab === 'delete'} class="ghost" onclick={() => requestManageAction(batchAction($manageTab))}>{batchLabel($manageTab)}</button>
  </div>
  <div class="resultScroll" style="max-height:320px; margin-top:14px">
    <table style="table-layout:fixed">
      <thead>
        <tr>
          <th style="width:5%"><input id="manageSelectAll" type="checkbox" checked={$manageWorkflowState.scanRows.length > 0 && $manageWorkflowState.selectedScanRows.length === $manageWorkflowState.scanRows.length} onchange={(event) => requestManageAction('toggleManageSelectAll', { checked: event.currentTarget.checked })}></th>
          <th id="manageScanHeadCurrent" style="width:25%">Current</th>
          <th id="manageScanHeadStatus" style="width:15%">{$manageTab === 'delete' ? 'Type' : 'Status'}</th>
          <th id="manageScanHeadSuggested" style="width:23%">{$manageTab === 'delete' ? 'Path' : 'Suggested'}</th>
          <th id="manageScanHeadContents" style="width:12%">Contents</th>
          <th id="manageScanHeadAction" style="width:20%">Action</th>
        </tr>
      </thead>
      <tbody id="manageScanTable">
        {#if !$manageWorkflowState.scanRows.length}
          <tr><td colspan="6" class="empty">{$manageWorkflowState.scanConfig.empty}</td></tr>
        {:else}
          {#each $manageWorkflowState.scanRows as item, idx}
            <tr>
              <td><input type="checkbox" checked={$manageWorkflowState.selectedScanRows.includes(idx)} onchange={(event) => requestManageAction('toggleManageRowSelection', { index: idx, checked: event.currentTarget.checked })}></td>
              <td class="mono"><span class="cellEllipsis" title={item.path || ''}>{item.current || item.base || ''}</span></td>
              <td><span class={`pill ${($manageTab === 'move' || item.isDir) ? 'pillDir' : 'pillFile'}`}>{statusLabel($manageTab, item)}</span></td>
              <td class="mono"><span class="cellEllipsis" title={$manageTab === 'delete' ? (item.path || '') : (item.newPath || item.suggested || item.path || '')}>{$manageTab === 'delete' ? (item.path || '') : (item.suggested || '')}</span></td>
              <td><span class="fdFile tooltipish" title="descendant files">{item.fileCount || 0} F</span> <span class="fdDir tooltipish" title="descendant directories">{item.dirCount || 0} D</span></td>
              <td>
                <div class="row" style="margin:0">
                  <button class:warn={$manageTab === 'delete'} onclick={rowAction($manageTab, idx)}>Preview</button>
                  {#if secondaryAction($manageTab, idx)}
                    <button class="ghost" onclick={secondaryAction($manageTab, idx)}>{secondaryLabel($manageTab)}</button>
                  {/if}
                  <button class="ghost iconBtn" title="Show in Browse" onclick={(event) => showInBrowse(item.path || '', item.isDir !== false, event)}>↗</button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
