<script>
  import { onMount } from 'svelte';
  import { bindManageModal, manageModal } from '../_states/manageModal.js';
  import { requestManageAction } from '../_states/uiCommands.js';

  let cleanup = () => {};

  onMount(() => {
    cleanup = bindManageModal(window);
    return () => cleanup();
  });
</script>

<div
  id="manageModal"
  class="modalWrap"
  class:active={$manageModal.active}
  onclick={(event) => requestManageAction('closeManageModal', { overlay: true })}
>
  <div class="modalCard" onclick={(event) => event.stopPropagation()}>
    <div class="modalHeader">
      <div>
        <h2 id="manageModalTitle">{$manageModal.title || 'Confirm Change'}</h2>
        <div id="manageModalSubtitle" class="mono" style="color:var(--muted); margin-top:4px">
          {$manageModal.subtitle || ''}
        </div>
      </div>
      <button class="ghost" onclick={() => requestManageAction('closeManageModal')}>Cancel</button>
    </div>
    <div class="modalBody">
      <div id="manageModalBody" class="previewList">{@html $manageModal.bodyHtml || ''}</div>
    </div>
    <div class="modalFooter">
      <div class="mono" style="color:var(--muted)">This will run immediately after confirmation.</div>
      <div class="row" style="margin:0">
        <button class="ghost" onclick={() => requestManageAction('closeManageModal')}>Cancel</button>
        <button id="manageConfirmBtn" onclick={() => requestManageAction('confirmManage')}>OK</button>
      </div>
    </div>
  </div>
</div>
