<script>
  import { onMount } from 'svelte';
  import { bindManageFormState, manageFormState } from '../_states/manageFormState.js';
  import { requestManageAction, requestManageFormPatch } from '../_states/uiCommands.js';

  let cleanup = () => {};

  onMount(() => {
    cleanup = bindManageFormState(window);
    return () => cleanup();
  });
</script>

<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)">
  <div class="previewLabel">Steps</div>
  <div>1. Scan rename candidates.</div>
  <div>2. Preview a row to review the suggested target path.</div>
  <div>3. Adjust the target only if needed, then queue it.</div>
  <div>Example: rename a temporary episodic folder into the grouped folder form before moving it later.</div>
</div>
<div class="field">
  <label for="manageSuggestedName">Suggested Name</label>
  <div class="row">
    <input id="manageSuggestedName" value={$manageFormState.suggestedName} placeholder="Series Name S01 12Ew0" oninput={(event) => requestManageFormPatch({ suggestedName: event.currentTarget.value })}>
    <button class="secondary" onclick={() => requestManageAction('suggestRenameFromRenameTab')}>Suggest</button>
    <button class="ghost" onclick={() => requestManageAction('suggestSubtitleRenameFromRenameTab')}>Subtitle</button>
  </div>
</div>
<div class="field">
  <label for="manageRenameTarget">Rename To Path</label>
  <input id="manageRenameTarget" value={$manageFormState.renameTarget} placeholder="/path/to/Series Name S01 12Ew0" oninput={(event) => { event.currentTarget.dataset.manual = event.currentTarget.value.trim() ? '1' : ''; requestManageFormPatch({ renameTarget: event.currentTarget.value }); }}>
</div>
<div class="row" style="margin-top:14px">
  <button onclick={() => requestManageAction('previewManage', { mode: 'rename' })}>Preview Rename</button>
  <button class="ghost" onclick={() => requestManageAction('setManageSelectedSourceFromBrowse')}>Use Current Browse Path</button>
</div>
