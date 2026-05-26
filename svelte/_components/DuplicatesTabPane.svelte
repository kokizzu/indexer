<script>
  import { onMount } from 'svelte';
  import { activeTab } from '../_states/activeTab.js';
  import IndexerApi from '../jsApi.GEN.js';
  import { showToast } from '../_helpers/xNotifier.js';
  import { formatBytesHtml } from '../_helpers/xFormatter.js';

  let rows = [];
  let loading = false;
  let error = '';

  function toast(message) {
    showToast(message);
  }

  async function copyPath(path, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(path || '');
      toast('Copied path');
    } catch (err) {
      toast('Copy failed: ' + err);
    }
  }

  async function refreshDuplicates() {
    loading = true;
    error = '';
    try {
      const res = await fetch(IndexerApi.duplicates || '/api/duplicates');
      const text = await res.text();
      if (!res.ok) throw new Error(text || ('HTTP ' + res.status));
      rows = text ? JSON.parse(text) : [];
    } catch (err) {
      rows = [];
      error = String(err?.message || err);
      toast(error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    refreshDuplicates();
  });
</script>

<section id="tab-duplicates" class:active={$activeTab === 'duplicates'} class="tabPane">
  <div class="card">
    <div class="cardInner">
      <div class="row">
        <button class="secondary" onclick={refreshDuplicates}>Refresh Duplicates</button>
      </div>
      <div class="resultPane" style="margin-top:16px">
        <div class="resultHeader">
          <h2>Duplicate Groups</h2>
          <div class="mono" style="color:var(--muted)">
            {#if loading}
              loading...
            {:else}
              {rows.length} groups
            {/if}
          </div>
        </div>
        <div class="resultScroll">
          <table style="table-layout:fixed">
            <thead>
              <tr>
                <th style="width:9%">Copies</th>
                <th style="width:11%">Size</th>
                <th style="width:20%">Fingerprint</th>
                <th style="width:60%">Paths</th>
              </tr>
            </thead>
            <tbody>
              {#if error}
                <tr><td colspan="4" class="empty">{error}</td></tr>
              {:else if !rows.length && !loading}
                <tr><td colspan="4" class="empty">No duplicate groups</td></tr>
              {:else}
                {#each rows as item}
                  <tr>
                    <td>{(item.paths || []).length}</td>
                    <td>{@html formatBytesHtml(item.size || 0)}</td>
                    <td class="mono"><span class="cellEllipsis" title={item.fingerprint || ''}>{item.fingerprint || ''}</span></td>
                    <td class="mono">
                      {#each item.paths || [] as path}
                        <div class="nameCell">
                          <span class="nameLabel cellEllipsis" title={path}>{path}</span>
                          <span class="rowActions">
                            <button class="ghost iconBtn" title={path} onclick={(event) => copyPath(path, event)}>⧉</button>
                          </span>
                        </div>
                      {/each}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>
