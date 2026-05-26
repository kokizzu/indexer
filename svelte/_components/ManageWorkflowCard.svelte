<script>
  import { onMount } from 'svelte';
  import manageTabs from '../_states/manageTabs.js';
  import { bindManageTab, manageTab, setManageTab } from '../_states/manageTab.js';
  import ManageCommonPane from './ManageCommonPane.svelte';
  import ManageDeletePane from './ManageDeletePane.svelte';
  import ManageMovePane from './ManageMovePane.svelte';
  import ManageRenamePane from './ManageRenamePane.svelte';
  import ManageSuggestPane from './ManageSuggestPane.svelte';
  import ManageSubtitlePane from './ManageSubtitlePane.svelte';
  import { requestSwitchManageTab } from '../_states/uiCommands.js';

  let cleanup = () => {};

  onMount(() => {
    cleanup = bindManageTab(window);
    return () => cleanup();
  });

  function clickManageTab(tab, event) {
    setManageTab(tab.id);
    requestSwitchManageTab(tab.id);
  }
</script>

<div class="card">
  <div class="cardInner">
    <h2>Manage</h2>
    <div class="previewBox" style="margin-bottom:16px">
      <div class="previewLabel">Flow</div>
      <div style="color:var(--muted); line-height:1.55">
        Step 1: choose what kind of maintenance you want to do.
        <br>Step 2: scan only for candidates relevant to that mode.
        <br>Step 3: preview one candidate or queue the action.
        <br>Only the real action asks for password. Preview and scan stay password-free.
        <br><strong>Root</strong> is the configured top-level media root.
        <br><strong>Optional Subdirectory</strong> narrows the scan inside that root. Leave it empty to scan the whole root.
        <br>Use <strong>Current Browse Path</strong> to avoid typing when you already navigated to the right area in Browse.
      </div>
    </div>
    <div class="subTabs">
      {#each manageTabs as tab}
        <button
          class:active={$manageTab === tab.id}
          class="subTabBtn"
          data-manage-tab={tab.id}
          onclick={(event) => clickManageTab(tab, event)}
        >{tab.label}</button>
      {/each}
    </div>
    <div id="manage-pane-suggest" class="subPane" class:active={$manageTab === 'suggest'}>
      <ManageSuggestPane />
    </div>
    <div id="manage-pane-common" class="subPane" class:active={$manageTab !== 'subtitles'}>
      <ManageCommonPane />
    </div>
    <div id="manage-pane-subtitles" class="subPane" class:active={$manageTab === 'subtitles'}>
      <ManageSubtitlePane />
    </div>
    <div id="manage-pane-rename" class="subPane" class:active={$manageTab === 'rename'}>
      <ManageRenamePane />
    </div>
    <div id="manage-pane-move" class="subPane" class:active={$manageTab === 'move'}>
      <ManageMovePane />
    </div>
    <div id="manage-pane-delete" class="subPane" class:active={$manageTab === 'delete'}>
      <ManageDeletePane />
    </div>
  </div>
</div>
