<script>
  import { onMount } from 'svelte';
  import tabs from '../_states/tabs.js';
  import { activeTab, bindActiveTab, setActiveTab } from '../_states/activeTab.js';
  import { requestSwitchTab } from '../_states/uiCommands.js';

  let cleanup = () => {};

  onMount(() => {
    cleanup = bindActiveTab(window, localStorage);
    return () => cleanup();
  });

  function clickTab(tab, event) {
    setActiveTab(tab.id, localStorage);
    requestSwitchTab(tab.id);
  }
</script>

<div class="tabs">
  {#each tabs as tab}
    <button
      class:active={$activeTab === tab.id}
      class="tabBtn"
      data-tab={tab.id}
      onclick={(event) => clickTab(tab, event)}
    >{tab.label}</button>
  {/each}
</div>
