<script>
  import { onMount } from 'svelte';
  import { bindBrowseBridgeState, browseBridgeState } from '../_states/browseBridgeState.js';
  import { bindManageFormState, manageFormState } from '../_states/manageFormState.js';
  import { bindManageWorkflowState, manageWorkflowState } from '../_states/manageWorkflowState.js';
  import { requestManageAction, requestManageFormPatch } from '../_states/uiCommands.js';
  import { showToast } from '../_helpers/xNotifier.js';

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

  async function copyPath(path, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(path || '');
      showToast('Copied path');
    } catch (err) {
      showToast('Copy failed: ' + err);
    }
  }

  function rootLabel(root) {
    if (!root) return '';
    return root.base && root.base !== root.path ? `${root.base} · ${root.path}` : (root.path || '');
  }
</script>

<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)">
  <div class="previewLabel">Steps</div>
  <div>1. Choose the root to scan for subtitle fixes.</div>
  <div>2. Optionally narrow the subtitle scan path.</div>
  <div>3. Scan subtitle renames, then queue rows one by one.</div>
  <div>Example: <span class="mono">2_English.srt</span> can become <span class="mono">Episode.Name.en.srt</span>.</div>
</div>
<div class="field">
  <label for="manageSubtitleRoot">Scan Root</label>
  <select id="manageSubtitleRoot" value={$manageFormState.subtitleRoot} onchange={(event) => requestManageFormPatch({ subtitleRoot: event.currentTarget.value })}>
    {#each $browseBridgeState.roots as root}
      <option value={root.path}>{rootLabel(root)}</option>
    {/each}
  </select>
</div>
<div class="field">
  <label for="manageSubtitlePath">Optional Subdirectory</label>
  <input id="manageSubtitlePath" value={$manageFormState.subtitlePath} placeholder="Series/Season/Subs" oninput={(event) => { event.currentTarget.dataset.manual = event.currentTarget.value.trim() ? '1' : ''; requestManageFormPatch({ subtitlePath: event.currentTarget.value }); }}>
</div>
<div class="row" style="margin-top:14px">
  <button class="secondary" onclick={() => requestManageAction('scanSubtitleCandidates')}>Scan Subtitle Renames</button>
  <button class="ghost" onclick={() => requestManageAction('prefillManageFromBrowse', { kind: 'subtitles' })}>Use Current Browse Path</button>
</div>
<div class="resultPane" style="margin-top:16px">
  <div class="resultHeader">
    <h2>Subtitle Rename Candidates</h2>
    <div id="subtitleScanCount" class="mono" style="color:var(--muted)">{$manageWorkflowState.subtitleRows.length} rows</div>
  </div>
  <div class="resultScroll" style="max-height:360px">
    <table style="table-layout:fixed">
      <thead>
        <tr>
          <th style="width:38%">Current</th>
          <th style="width:38%">Suggested</th>
          <th style="width:24%">Action</th>
        </tr>
      </thead>
      <tbody id="subtitleScanTable">
        {#if !$manageWorkflowState.subtitleRows.length}
          <tr><td colspan="3" class="empty">No subtitle rename candidates</td></tr>
        {:else}
          {#each $manageWorkflowState.subtitleRows as item, idx}
            <tr>
              <td class="mono"><span class="cellEllipsis" title={item.path || ''}>{item.current || ''}</span></td>
              <td class="mono"><span class="cellEllipsis" title={item.newPath || ''}>{item.suggested || ''}</span></td>
              <td><div class="row" style="margin:0"><button class="ghost iconBtn" title={item.path || ''} onclick={(event) => copyPath(item.path || '', event)}>⧉</button><button onclick={() => requestManageAction('queueSubtitleRename', { index: idx })}>Rename</button></div></td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
