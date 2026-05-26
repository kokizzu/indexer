<script>
  import { onDestroy, onMount } from 'svelte';
  import { activeTab } from '../_states/activeTab.js';
  import IndexerApi from '../jsApi.GEN.js';
  import { showToast } from '../_helpers/xNotifier.js';
  import { renderManageTaskMeta, renderManageMessage } from '../_helpers/categorizeQueue.js';

  let runningTasks = [];
  let queued = [];
  let historyRows = [];
  let selectedQueueRows = [];
  let selectedHistoryRows = [];
  let queueError = '';
  let historyError = '';
  let resultText = '';
  let queueTimer = null;
  let historyTimer = null;

  function apiUrl(key, fallback) {
    return IndexerApi[key] || fallback;
  }

  function toast(message) {
    if (!message) return;
    showToast(String(message));
  }

  function renderMetaHtml(task) {
    return renderManageTaskMeta(task) || '';
  }

  function renderMessageHtml(message) {
    return renderManageMessage(message) || '';
  }

  async function getJSON(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || ('HTTP ' + res.status));
    }
    return text ? JSON.parse(text) : {};
  }

  async function postJSON(url, body) {
    return getJSON(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
  }

  function updateSelectedRows(existing, rows) {
    const valid = new Set((rows || []).map(item => item?.id).filter(Boolean));
    return (existing || []).filter(id => valid.has(id));
  }

  async function refreshQueue() {
    try {
      const res = await getJSON(apiUrl('manageStatus', '/api/manage/status'));
      runningTasks = (res.runningTasks && res.runningTasks.length ? res.runningTasks : (res.running?.id ? [res.running] : [])) || [];
      queued = res.queued || [];
      selectedQueueRows = updateSelectedRows(selectedQueueRows, queued);
      queueError = '';
    } catch (err) {
      queueError = String(err?.message || err);
    }
  }

  async function refreshHistory() {
    try {
      const rows = await getJSON(apiUrl('manageHistory', '/api/manage/history') + '?limit=100');
      historyRows = Array.isArray(rows) ? rows : [];
      selectedHistoryRows = updateSelectedRows(selectedHistoryRows, historyRows);
      historyError = '';
    } catch (err) {
      historyError = String(err?.message || err);
    }
  }

  function toggleQueueSelection(id, checked) {
    selectedQueueRows = checked
      ? [...selectedQueueRows, id].filter((value, idx, arr) => arr.indexOf(value) === idx)
      : selectedQueueRows.filter(value => value !== id);
  }

  function toggleHistorySelection(id, checked) {
    selectedHistoryRows = checked
      ? [...selectedHistoryRows, id].filter((value, idx, arr) => arr.indexOf(value) === idx)
      : selectedHistoryRows.filter(value => value !== id);
  }

  async function cancelTask(id) {
    if (!id) return;
    try {
      const res = await postJSON(apiUrl('manageCancel', '/api/manage/cancel'), { id });
      resultText = res?.message || 'Queued task cancelled';
      toast(resultText);
      await Promise.all([refreshQueue(), refreshHistory()]);
    } catch (err) {
      const message = String(err?.message || err);
      resultText = message;
      toast(message);
    }
  }

  async function cancelSelected() {
    if (!selectedQueueRows.length) {
      toast('No queued tasks selected');
      return;
    }
    let cancelled = 0;
    const errors = [];
    for (const id of selectedQueueRows) {
      try {
        await postJSON(apiUrl('manageCancel', '/api/manage/cancel'), { id });
        cancelled += 1;
      } catch (err) {
        errors.push(String(err?.message || err));
      }
    }
    selectedQueueRows = [];
    resultText = errors.length ? `cancelled=${cancelled} errors=${errors.length}` : `cancelled=${cancelled}`;
    toast(errors.length ? 'Batch cancel finished with errors' : `Batch cancel: ${cancelled}`);
    await Promise.all([refreshQueue(), refreshHistory()]);
  }

  async function retryTask(id) {
    if (!id) return;
    const password = window.prompt('Manage password?') || '';
    if (!password) {
      toast('Password is required to retry this action');
      return;
    }
    try {
      const res = await postJSON(apiUrl('manageRetry', '/api/manage/retry'), { id, password });
      resultText = res?.message || 'Manage action retried';
      toast(resultText);
      await Promise.all([refreshQueue(), refreshHistory()]);
    } catch (err) {
      const message = String(err?.message || err);
      resultText = message;
      toast(message);
    }
  }

  async function retrySelected() {
    if (!selectedHistoryRows.length) {
      toast('No history rows selected');
      return;
    }
    const password = window.prompt('Manage password?') || '';
    if (!password) {
      toast('Password is required to retry these actions');
      return;
    }
    let retried = 0;
    const errors = [];
    for (const id of selectedHistoryRows) {
      try {
        await postJSON(apiUrl('manageRetry', '/api/manage/retry'), { id, password });
        retried += 1;
      } catch (err) {
        errors.push(String(err?.message || err));
      }
    }
    selectedHistoryRows = [];
    resultText = errors.length ? `retried=${retried} errors=${errors.length}` : `retried=${retried}`;
    toast(errors.length ? 'Batch retry finished with errors' : `Batch retry: ${retried}`);
    await Promise.all([refreshQueue(), refreshHistory()]);
  }

  function handleQueueRefreshRequest() {
    refreshQueue();
  }

  function handleHistoryRefreshRequest() {
    refreshHistory();
  }

  onMount(async () => {
    await Promise.all([refreshQueue(), refreshHistory()]);
    window.addEventListener('indexer:queueRefreshRequest', handleQueueRefreshRequest);
    window.addEventListener('indexer:historyRefreshRequest', handleHistoryRefreshRequest);
    queueTimer = window.setInterval(refreshQueue, 3000);
    historyTimer = window.setInterval(refreshHistory, 5000);
  });

  onDestroy(() => {
    window.removeEventListener('indexer:queueRefreshRequest', handleQueueRefreshRequest);
    window.removeEventListener('indexer:historyRefreshRequest', handleHistoryRefreshRequest);
    if (queueTimer) window.clearInterval(queueTimer);
    if (historyTimer) window.clearInterval(historyTimer);
  });
</script>

<section id="tab-queue" class:active={$activeTab === 'queue'} class="tabPane">
  <div class="split">
    <div class="card">
      <div class="cardInner">
        <div class="resultHeader">
          <h2>Queue</h2>
          <div class="row" style="margin:0">
            <button class="ghost warn" onclick={cancelSelected}>Cancel Selected</button>
            <button class="ghost" onclick={refreshQueue}>Refresh</button>
          </div>
        </div>
        <div class="previewBox">
          {#if queueError}
            <div class="mono">{queueError}</div>
          {:else if !runningTasks.length && !queued.length}
            No queued actions.
          {:else}
            {#each runningTasks as task}
              <div class="previewItem">
                <div class="previewLabel">Running</div>
                <div class="mono">
                  {task.action || ''} • {task.srcPath || ''}{task.dstPath ? ` → ${task.dstPath}` : ''}
                  <br>{task.status || ''}
                </div>
                {@html renderMetaHtml(task)}
                {@html renderMessageHtml(task.message || '')}
              </div>
            {/each}
            {#each queued as task}
              <div class="previewItem">
                <div class="previewLabel">Queued</div>
                <div class="mono">
                  {task.action || ''} • {task.srcPath || ''}{task.dstPath ? ` → ${task.dstPath}` : ''}
                  <br>{task.status || ''}
                </div>
                {@html renderMetaHtml(task)}
                <div class="row" style="margin:6px 0 0 0">
                  <input type="checkbox" checked={selectedQueueRows.includes(task.id)} onchange={(event) => toggleQueueSelection(task.id, event.currentTarget.checked)}>
                  <button class="ghost warn" onclick={() => cancelTask(task.id)}>Cancel</button>
                </div>
                {@html renderMessageHtml(task.message || '')}
              </div>
            {/each}
          {/if}
        </div>
        {#if resultText}
          <div class="previewBox mono" style="min-height:auto; margin-top:12px">{resultText}</div>
        {/if}
      </div>
    </div>
    <div class="card">
      <div class="cardInner">
        <div class="resultHeader">
          <h2>History</h2>
          <div class="row" style="margin:0">
            <button class="ghost" onclick={retrySelected}>Retry Selected</button>
            <button class="ghost" onclick={refreshHistory}>Refresh</button>
          </div>
        </div>
        <div class="resultScroll" style="max-height:520px">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Status</th>
                <th>Source</th>
                <th>Target</th>
                <th>Finished</th>
              </tr>
            </thead>
            <tbody>
              {#if historyError}
                <tr><td colspan="5" class="empty">{historyError}</td></tr>
              {:else if !historyRows.length}
                <tr><td colspan="5" class="empty">No history yet</td></tr>
              {:else}
                {#each historyRows as item}
                  <tr>
                    <td>
                      <div class="row" style="margin:0">
                        <input type="checkbox" checked={selectedHistoryRows.includes(item.id)} onchange={(event) => toggleHistorySelection(item.id, event.currentTarget.checked)}>
                        <span>{item.action || ''}</span>
                      </div>
                    </td>
                    <td>{item.status || ''}</td>
                    <td><span class="cellEllipsis mono" title={item.srcPath || ''}>{item.srcPath || ''}</span></td>
                    <td><span class="cellEllipsis mono" title={item.dstPath || ''}>{item.dstPath || ''}</span></td>
                    <td>
                      <div class="mono">{item.finishedAt || ''}</div>
                      {@html renderMetaHtml(item)}
                      <div class="row" style="margin:6px 0 0 0"><button class="ghost" onclick={() => retryTask(item.id)}>Retry</button></div>
                      {#if item.message}
                        <div style="margin-top:4px">{@html renderMessageHtml(item.message)}</div>
                      {/if}
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
