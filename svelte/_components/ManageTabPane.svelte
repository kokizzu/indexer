<script>
  import { activeTab } from '../_states/activeTab.js';
  import ManageWorkflowCard from './ManageWorkflowCard.svelte';
  import ManagePreviewCard from './ManagePreviewCard.svelte';
</script>

<section id="tab-manage" class:active={$activeTab === 'manage'} class="tabPane">
  <div class="split">
    <ManageWorkflowCard />
    <ManagePreviewCard />
  </div>
</section>
