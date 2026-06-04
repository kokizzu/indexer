<script>
  import { onDestroy, onMount } from 'svelte';
  import { activeTab } from '../_states/activeTab.js';
  import IndexerApi from '../jsApi.GEN.js';
  import { showToast } from '../_helpers/xNotifier.js';
  import { escapeHtml, formatBytes, formatBytesHtml } from '../_helpers/xFormatter.js';

  let availableRoots = [];
  let selectedPriorityRoots = [];
  let status = {};
  let loadingStatus = true;
  let startingReindex = false;
  let statusError = '';
  let pollTimer = null;
  let mounted = false;

  function apiUrl(key, fallback) {
    return IndexerApi[key] || fallback;
  }

  function toast(message) {
    if (!message) return;
    showToast(String(message));
  }

  function rootLabel(root) {
    if (!root) return '';
    return root.base && root.base !== root.path ? `${root.base} · ${root.path}` : (root.path || '');
  }

  function progressPct(snapshot) {
    const mounts = snapshot?.mounts || [];
    const allRoots = mounts.flatMap(mount => mount.roots || []);
    if (allRoots.length) {
      return allRoots.reduce((acc, root) => acc + Number(root.progressPct || 0), 0) / allRoots.length;
    }
    return Number(snapshot?.progressPct || 0);
  }

  function progressMeta(snapshot) {
    const s = snapshot || {};
    return [
      'resumed=' + Boolean(s.resumed) +
        '  workers=' + (s.activeWorkers || 0) + '/' + (s.workerCount || 0) +
        '  roots=' + (s.estimatedRoots || 0) + '/' + (s.totalRoots || 0),
      'duration=' + (s.duration || '0s'),
      'estimated=' + formatBytes(s.totalBytes || 0) +
        '  processed=' + formatBytes(s.processedBytes || 0) +
        '  indexed=' + (s.indexed || 0) +
        '  files=' + (s.files || 0) +
        '  dirs=' + (s.directories || 0),
      'current=' + (s.currentPath || '')
    ].join('\n');
  }

  async function getJSON(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || ('HTTP ' + res.status));
    }
    return text ? JSON.parse(text) : {};
  }

  async function loadRoots() {
    try {
      const rows = await getJSON(apiUrl('browse', '/api/browse'));
      availableRoots = (Array.isArray(rows) ? rows : []).map(row => ({
        path: row.path || '',
        base: row.base || ''
      }));
      const valid = new Set(availableRoots.map(row => row.path));
      selectedPriorityRoots = selectedPriorityRoots.filter(path => valid.has(path));
    } catch (err) {
      toast('Browse roots failed: ' + (err?.message || err));
    }
  }

  async function refreshStatus() {
    try {
      const next = await getJSON(apiUrl('status', '/api/status'));
      status = next || {};
      statusError = '';
    } catch (err) {
      statusError = String(err?.message || err);
    } finally {
      loadingStatus = false;
    }
  }

  async function startReindex() {
    startingReindex = true;
    try {
      const url = new URL(apiUrl('reindex', '/api/reindex'), window.location.origin);
      if (selectedPriorityRoots.length) {
        url.searchParams.set('priority', selectedPriorityRoots.join(','));
      }
      const res = await getJSON(url.toString(), { method: 'POST' });
      if (res?.message) toast(res.message);
      await refreshStatus();
    } catch (err) {
      toast(err?.message || err);
      statusError = String(err?.message || err);
    } finally {
      startingReindex = false;
    }
  }

  function syncPolling() {
    if (!mounted) return;
    const shouldPoll = $activeTab === 'indexer' && (startingReindex || Boolean(status?.running));
    if (shouldPoll && !pollTimer) {
      pollTimer = window.setInterval(refreshStatus, 1000);
    } else if (!shouldPoll && pollTimer) {
      window.clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  $: shouldPollStatus = mounted && $activeTab === 'indexer' && (startingReindex || Boolean(status?.running));
  $: if (mounted) {
    if (shouldPollStatus && !pollTimer) {
      pollTimer = window.setInterval(refreshStatus, 1000);
    } else if (!shouldPollStatus && pollTimer) {
      window.clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  onMount(async () => {
    await Promise.all([loadRoots(), refreshStatus()]);
    mounted = true;
    syncPolling();
  });

  onDestroy(() => {
    if (pollTimer) window.clearInterval(pollTimer);
  });
</script>

<section id="tab-indexer" class:active={$activeTab === 'indexer'} class="tabPane">
  <section class="hero">
    <div class="card">
      <div class="cardInner">
        <h1>Indexer</h1>
        <p>Local media indexer for video libraries. Search is built from folder names and video filenames, with resumable mount-aware reindex and safe local file operations.</p>
        <div class="row" style="margin-top:14px">
          <button onclick={startReindex} disabled={startingReindex || Boolean(status?.running)}>
            {startingReindex ? 'Starting...' : status?.running ? 'Running...' : 'Start Reindex'}
          </button>
          <select bind:value={selectedPriorityRoots} multiple size="5" style="min-width:340px">
            {#each availableRoots as root}
              <option value={root.path}>{rootLabel(root)}</option>
            {/each}
          </select>
        </div>
        <div class="progressWrap">
          <div class="progressBar"><div class="progressFill" style={`width:${progressPct(status).toFixed(2)}%`}></div></div>
          <div class="progressMeta">{progressMeta(status)}</div>
        </div>
        <div class="heroMeta">
          <div class="metric"><div class="metricLabel">Workers</div><div class="metricValue">{status.activeWorkers || 0} / {status.workerCount || 0}</div></div>
          <div class="metric"><div class="metricLabel">Roots</div><div class="metricValue">{status.estimatedRoots || 0} / {status.totalRoots || 0}</div></div>
          <div class="metric"><div class="metricLabel">Files / Dirs</div><div class="metricValue">{status.files || 0} / {status.directories || 0}</div></div>
          <div class="metric"><div class="metricLabel">Indexed Size</div><div class="metricValue">{@html formatBytesHtml(status.totalBytes || 0)}</div></div>
          <div class="metric"><div class="metricLabel">Duration</div><div class="metricValue mono">{status.duration || '0s'}</div></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="cardInner">
        <h2>Status</h2>
        <div class="statusBox">{#if statusError}{statusError}{:else if loadingStatus}loading...{:else}<pre>{JSON.stringify(status || {}, null, 2)}</pre>{/if}</div>
      </div>
    </div>
  </section>
  <div class="card">
    <div class="cardInner">
      <h2>Per Root Progress</h2>
      <div class="progressGrid">
        {#if !status.mounts?.length}
          <div class="empty">No mounted root progress yet</div>
        {:else}
          {#each status.mounts || [] as mount}
            <div class="mountCard">
              <div><strong>{mount.mountPoint || '(unknown)'}</strong> <span class="mono">{Number(mount.progressPct || 0).toFixed(2)}%</span></div>
              <div class="progressBar" style="margin:6px 0 8px"><div class="progressFill" style={`width:${Number(mount.progressPct || 0).toFixed(2)}%`}></div></div>
              {#each mount.roots || [] as root}
                <div class="rootCard">
                  <div><span class="pill">{root.kind || ''}</span>{root.path || ''}</div>
                  <div class="mono" style="color:var(--muted); margin-top:3px">
                    {@html formatBytesHtml(root.processedBytes || 0)} / {@html formatBytesHtml(root.totalBytes || 0)}
                  </div>
                  <div class="progressBar" style="margin-top:4px"><div class="progressFill" style={`width:${Number(root.progressPct || 0).toFixed(2)}%`}></div></div>
                </div>
              {/each}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>
