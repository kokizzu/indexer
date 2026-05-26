<script>
  import { onMount } from 'svelte';
  import { bindManageFormState, manageFormState } from '../_states/manageFormState.js';
  import { requestManageFormPatch } from '../_states/uiCommands.js';

  let cleanup = () => {};

  onMount(() => {
    cleanup = bindManageFormState(window);
    return () => cleanup();
  });
</script>

<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)">
  <div class="previewLabel">Steps</div>
  <div>1. Pick a root and optional subdirectory.</div>
  <div>2. Scan only directories whose names look fixable.</div>
  <div>3. Preview one row to see the suggested cleaned folder name, grouped moves, ambiguous subtitles, and queueable categorize action.</div>
  <div>Example: <span class="mono">Show.Name.S01.[12Ew0]</span> becomes a cleaner grouped folder proposal before rename or categorize.</div>
</div>
<div class="field">
  <label for="manageCategorizeWatched">Categorize Watched Count</label>
  <input
    id="manageCategorizeWatched"
    type="number"
    min="0"
    step="1"
    value={$manageFormState.categorizeWatched}
    placeholder="0"
    oninput={(event) => requestManageFormPatch({ categorizeWatched: Number(event.currentTarget.value || 0) || 0 })}
  >
</div>
<div class="row" style="margin-top:8px">
  <label class="checkRow"><input id="manageCategorizeVideosOnly" type="checkbox" checked={$manageFormState.categorizeVideosOnly} onchange={(event) => requestManageFormPatch({ categorizeVideosOnly: !!event.currentTarget.checked })}>videos only</label>
  <label class="checkRow"><input id="manageCategorizeRemoveEmpty" type="checkbox" checked={$manageFormState.categorizeRemoveEmpty} onchange={(event) => requestManageFormPatch({ categorizeRemoveEmpty: !!event.currentTarget.checked })}>remove empty dirs when applying</label>
</div>
