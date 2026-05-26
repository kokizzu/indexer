<script>
  import { onMount } from 'svelte';
  import AppPage from './AppPage.svelte';
  import { initAppController } from '../appController.js';

  onMount(() => {
    initAppController();
  });
</script>

<AppPage />
