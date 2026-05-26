<script>
  import TabBar from './TabBar.svelte';
  import TabPanes from './TabPanes.svelte';
  import ManageModal from './ManageModal.svelte';
</script>

<div id="toastWrap" class="toastWrap"></div>
<div class="wrap">
  <TabBar />
  <TabPanes />
</div>
<ManageModal />
