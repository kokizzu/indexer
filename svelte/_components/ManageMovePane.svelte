<script>
  import { onMount } from 'svelte';
  import { bindBrowseBridgeState, browseBridgeState } from '../_states/browseBridgeState.js';
  import { bindManageFormState, manageFormState } from '../_states/manageFormState.js';
  import { requestManageFormPatch } from '../_states/uiCommands.js';

  let cleanup = () => {};
  let cleanupBrowse = () => {};

  onMount(() => {
    cleanup = bindManageFormState(window);
    cleanupBrowse = bindBrowseBridgeState(window);
    return () => {
      cleanup();
      cleanupBrowse();
    };
  });

  function rootLabel(root) {
    if (!root) return '';
    return root.base && root.base !== root.path ? `${root.base} · ${root.path}` : (root.path || '');
  }
</script>

<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)">
  <div class="previewLabel">Steps</div>
  <div>1. Scan only move-ready folders that already match the final <span class="mono">[...,of_wN]</span> form.</div>
  <div>2. Choose destination root and optional bucket.</div>
  <div>3. Preview one candidate, then queue it.</div>
  <div>Example: move <span class="mono">Show Name S01 [12of_w0]</span> into sorted root bucket <span class="mono">_w</span>.</div>
</div>
<div class="field">
  <label for="manageDstRoot">Destination Root</label>
  <select id="manageDstRoot" value={$manageFormState.dstRoot} onchange={(event) => requestManageFormPatch({ dstRoot: event.currentTarget.value })}>
    {#each $browseBridgeState.roots as root}
      <option value={root.path}>{rootLabel(root)}</option>
    {/each}
  </select>
</div>
<div class="field">
  <label for="manageDstSubdir">Destination Subdirectory</label>
  <input id="manageDstSubdir" value={$manageFormState.dstSubdir} placeholder="_ws or optional relative folder inside selected root" oninput={(event) => requestManageFormPatch({ dstSubdir: event.currentTarget.value })}>
</div>
