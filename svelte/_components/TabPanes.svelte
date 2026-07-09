<script>
  import tabs from '../_states/tabs.js';
  import BrowseTabPane from './BrowseTabPane.svelte';
  import DuplicatesTabPane from './DuplicatesTabPane.svelte';
  import IndexerTabPane from './IndexerTabPane.svelte';
  import ManageTabPane from './ManageTabPane.svelte';
  import QueueTabPane from './QueueTabPane.svelte';
  import SearchTabPane from './SearchTabPane.svelte';
  import BackupTabPane from './BackupTabPane.svelte';
</script>

{#each tabs as tab}
  {#if tab.id === 'browse'}
    <BrowseTabPane />
  {:else if tab.id === 'indexer'}
    <IndexerTabPane />
  {:else if tab.id === 'duplicates'}
    <DuplicatesTabPane />
  {:else if tab.id === 'manage'}
    <ManageTabPane />
  {:else if tab.id === 'search'}
    <SearchTabPane />
  {:else if tab.id === 'queue'}
    <QueueTabPane />
  {:else if tab.id === 'backup'}
    <BackupTabPane />
  {/if}
{/each}
