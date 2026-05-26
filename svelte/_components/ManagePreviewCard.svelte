<script>
  import { onMount } from 'svelte';
  import { bindManagePreview, managePreview } from '../_states/managePreview.js';

  let cleanup = () => {};

  onMount(() => {
    cleanup = bindManagePreview(window);
    return () => cleanup();
  });
</script>

<div class="card">
  <div class="cardInner">
    <h2 id="managePreviewTitle">{$managePreview.title}</h2>
    <div
      class="previewBox mono"
      style="margin-bottom:14px; min-height:auto; padding:10px 12px"
      id="manageSelectedSource"
    >{$managePreview.selectedSource}</div>
    <div id="managePreview" class="previewBox" data-locked={$managePreview.locked ? '1' : ''}>
      {@html $managePreview.previewHtml}
    </div>
    <div class="previewLabel" style="margin-top:14px">Last Response / Queue Result</div>
    <div id="manageResult" class="statusBox" style="margin-top:14px; min-height:180px">{$managePreview.resultText}</div>
  </div>
</div>
