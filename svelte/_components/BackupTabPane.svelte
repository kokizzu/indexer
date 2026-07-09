<script>
  import { onDestroy, onMount } from 'svelte';
  import { activeTab } from '../_states/activeTab.js';
  import IndexerApi from '../jsApi.GEN.js';
  import { showToast } from '../_helpers/xNotifier.js';
  import { formatBytesHtml } from '../_helpers/xFormatter.js';

  let estimate = {};
  let config = {};
  let loadingConfig = true;
  let loading = false;
  let running = false;
  let error = '';
  let resultText = '';
  let estimateElapsedSeconds = 0;
  let estimateTimer = null;
  let relativeNow = Date.now();
  let relativeTimer = null;

  $: estimateStatus = estimate?.backupStatus || estimate?.status || {};
  $: configStatus = config?.backupStatus || config?.status || {};
  $: backupStatus = Object.keys(estimateStatus).length ? estimateStatus : configStatus;
  $: currentBackupSize = estimate?.currentBackupSize ?? backupStatus?.currentBackupSize ?? 0;
  $: backupError = backupStatus?.lastScheduledBackupError || backupStatus?.lastBackupError || '';
  $: backupErrorTitle = backupStatus?.lastScheduledBackupError ? 'Last Scheduled Failure' : 'Last Backup Failure';
  $: backupErrorPreview = backupError.length > 1200 ? backupError.slice(0, 1200) + '\n...' : backupError;

  function apiUrl(key, fallback) {
    return IndexerApi[key] || fallback;
  }

  function toast(message) {
    if (!message) return;
    showToast(String(message));
  }

  async function getJSON(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || ('HTTP ' + res.status));
    }
    return text ? JSON.parse(text) : {};
  }

  async function refreshEstimate() {
    loading = true;
    estimateElapsedSeconds = 0;
    const started = Date.now();
    if (estimateTimer) window.clearInterval(estimateTimer);
    estimateTimer = window.setInterval(() => {
      estimateElapsedSeconds = (Date.now() - started) / 1000;
    }, 250);
    try {
      const url = new URL(apiUrl('backupEstimate', '/api/backup/estimate'), window.location.origin);
      url.searchParams.set('limit', '500');
      estimate = await getJSON(url.toString());
      estimateElapsedSeconds = Number(estimate?.elapsedSeconds || ((Date.now() - started) / 1000));
      if (estimate?.sources?.length || estimate?.target) {
        config = {
          sources: estimate.sources || config.sources || [],
          target: estimate.target || config.target || '',
          backupStatus: estimate.backupStatus || estimate.status || config.backupStatus || config.status || {},
        };
      }
      error = '';
    } catch (err) {
      error = String(err?.message || err);
    } finally {
      if (estimateTimer) {
        window.clearInterval(estimateTimer);
        estimateTimer = null;
      }
      loading = false;
    }
  }

  async function loadConfig() {
    loadingConfig = true;
    try {
      config = await getJSON(apiUrl('backupConfig', '/api/backup/config'));
      error = '';
    } catch (err) {
      error = String(err?.message || err);
      config = {};
    } finally {
      loadingConfig = false;
    }
  }

  async function runBackup() {
    running = true;
    resultText = '';
    try {
      const res = await getJSON(apiUrl('backupRun', '/api/backup/run'), { method: 'POST' });
      resultText = res?.message || 'backup completed';
      toast(resultText);
      await loadConfig();
      await refreshEstimate();
    } catch (err) {
      resultText = String(err?.message || err);
      toast(resultText);
    } finally {
      running = false;
    }
  }

  function rowClass(entry) {
    if (!entry?.existsInTarget) return 'pill pillFile';
    if (entry?.incrementBytes > 0) return 'pill';
    return 'pill pillDir';
  }

  function agoSuffix(value) {
    if (!value) return '';
    const date = new Date(value);
    const time = date.getTime();
    if (!Number.isFinite(time)) return '';
    const totalMinutes = Math.max(0, Math.floor((relativeNow - time) / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];
    if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`);
    if (hours) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
    if (minutes) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
    if (!parts.length) return '';
    return ` (${parts.join(' ')} ago)`;
  }

  function formatTimestamp(value) {
    if (!value) return '-';
    const date = new Date(value);
    const time = date.getTime();
    if (!Number.isFinite(time)) return value;
    const pad = item => String(item).padStart(2, '0');
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join('-') + ' ' + [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds()),
    ].join(':');
  }

  onMount(() => {
    loadConfig();
    relativeTimer = window.setInterval(() => {
      relativeNow = Date.now();
    }, 60000);
  });

  onDestroy(() => {
    if (estimateTimer) window.clearInterval(estimateTimer);
    if (relativeTimer) window.clearInterval(relativeTimer);
  });
</script>

<section id="tab-backup" class:active={$activeTab === 'backup'} class="tabPane">
  <div class="card">
    <div class="cardInner">
      <div class="resultHeader">
        <h2>Backup</h2>
        <div class="row" style="margin:0">
          <button onclick={refreshEstimate} disabled={loading || running || loadingConfig || !config?.sources?.length}>{loading ? 'Estimating...' : 'Estimate'}</button>
          <button class="secondary" onclick={runBackup} disabled={running || loading || loadingConfig || !config?.sources?.length}>{running ? 'Backing up...' : 'Run Backup'}</button>
        </div>
      </div>
      <div class="heroMeta">
        <div class="metric"><div class="metricLabel">Target</div><div class="metricValue mono">{estimate?.target || config?.target || '-'}</div></div>
        <div class="metric">
          <div class="metricLabel">Process User</div>
          <div class="metricValue mono">{config?.runtime?.user || '-'}{config?.runtime?.isRoot ? ' root' : config?.runtime?.sudoHelper ? ' sudo-helper' : ' non-root'}</div>
        </div>
        <div class="metric"><div class="metricLabel">Current Backup Size</div><div class="metricValue">{@html formatBytesHtml(currentBackupSize || 0)}</div></div>
        <div class="metric"><div class="metricLabel">Source Size</div><div class="metricValue">{@html formatBytesHtml(estimate?.sourceSize || 0)}</div></div>
        <div class="metric"><div class="metricLabel">Estimated Increment</div><div class="metricValue">{@html formatBytesHtml(estimate?.estimatedIncrement || 0)}</div></div>
        <div class="metric"><div class="metricLabel">Estimate Time</div><div class="metricValue mono">{loading ? estimateElapsedSeconds.toFixed(1) + 's' : (estimate?.elapsed || '-')}</div></div>
        <div class="metric"><div class="metricLabel">Last Estimate At</div><div class="metricValue mono">{backupStatus?.lastEstimateAt ? formatTimestamp(backupStatus.lastEstimateAt) + agoSuffix(backupStatus.lastEstimateAt) : '-'}</div></div>
        <div class="metric"><div class="metricLabel">Last Estimate Duration</div><div class="metricValue mono">{backupStatus?.lastEstimateDuration || '-'}</div></div>
        <div class="metric"><div class="metricLabel">Last Successful Backup At</div><div class="metricValue mono">{backupStatus?.lastBackupAt ? formatTimestamp(backupStatus.lastBackupAt) + agoSuffix(backupStatus.lastBackupAt) : '-'}</div></div>
        <div class="metric"><div class="metricLabel">Last Successful Duration</div><div class="metricValue mono">{backupStatus?.lastBackupDuration || '-'}</div></div>
        <div class="metric"><div class="metricLabel">Last Scheduled Attempt At</div><div class="metricValue mono">{backupStatus?.lastScheduledBackupAt ? formatTimestamp(backupStatus.lastScheduledBackupAt) + agoSuffix(backupStatus.lastScheduledBackupAt) : '-'}</div></div>
      </div>
      {#if config?.runtime?.rootHint}
        <div class="previewBox mono" style="min-height:auto; margin-top:12px">{config.runtime.rootHint}</div>
      {/if}
      {#if error}
        <div class="previewBox mono" style="min-height:auto; margin-top:12px">{error}</div>
      {/if}
      {#if estimate?.warnings?.length || config?.warnings?.length}
        <div class="previewBox mono" style="min-height:auto; margin-top:12px">
          {#each (estimate?.warnings?.length ? estimate.warnings : config.warnings) as warning}
            <div>{warning}</div>
          {/each}
        </div>
      {/if}
      {#if backupErrorPreview}
        <div class="previewBox mono" style="min-height:auto; margin-top:12px">
          <div class="metricLabel">{backupErrorTitle}</div>
          <div>{backupErrorPreview}</div>
        </div>
      {/if}
      {#if resultText}
        <div class="previewBox mono" style="min-height:auto; margin-top:12px">{resultText}</div>
      {/if}
    </div>
  </div>

  <div class="split backupSplit" style="margin-top:16px">
    <div class="card">
      <div class="cardInner">
        <div class="resultHeader">
          <h2>Backup Sources</h2>
          <div class="mono" style="color:var(--muted)">{config?.sources?.length || 0} lines</div>
        </div>
        <div class="previewBox mono">
          {#if loadingConfig}
            Loading backup config...
          {:else if !config?.sources?.length}
            BACKUP_SOURCES is empty.
          {:else}
            {#each config.sources as source}
              <div>{source}</div>
            {/each}
          {/if}
        </div>
        {#if config?.excludes?.length}
          <div class="resultHeader" style="margin-top:16px">
            <h2>Exclude Sources</h2>
            <div class="mono" style="color:var(--muted)">{config.excludes.length} lines</div>
          </div>
          <div class="previewBox mono">
            {#each config.excludes as exclude}
              <div>{exclude}</div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="card">
      <div class="cardInner">
        <div class="resultHeader">
          <h2>Largest Items</h2>
          <div class="mono" style="color:var(--muted)">
            {estimate?.entries?.length || 0}{estimate?.truncated ? ` / ${estimate.entryCount || 0}` : ''} rows
          </div>
        </div>
        <div class="resultScroll" style="max-height:620px">
          <table>
            <thead>
              <tr>
                <th style="width:12%">Kind</th>
                <th style="width:16%">Size</th>
                <th style="width:16%">Increment</th>
                <th style="width:56%">Source</th>
              </tr>
            </thead>
            <tbody>
              {#if loading}
                <tr><td colspan="4" class="empty">Estimating...</td></tr>
              {:else if !estimate?.entries?.length}
                <tr><td colspan="4" class="empty">No backup estimate rows</td></tr>
              {:else}
                {#each estimate.entries as entry}
                  <tr>
                    <td><span class={rowClass(entry)}>{entry.kind || ''}</span></td>
                    <td>{@html formatBytesHtml(entry.size || 0)}</td>
                    <td>{@html formatBytesHtml(entry.incrementBytes || 0)}</td>
                    <td><span class="cellEllipsis mono" title={entry.path || ''}>{entry.path || ''}</span></td>
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
