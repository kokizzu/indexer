<script>
  import { onDestroy, onMount } from 'svelte';
  import { activeTab, setActiveTab } from '../_states/activeTab.js';
  import BrowseTreeNode from './BrowseTreeNode.svelte';
  import IndexerApi from '../jsApi.GEN.js';
  import { showToast } from '../_helpers/xNotifier.js';
  import { formatBytesHtml, formatAgeByMode } from '../_helpers/xFormatter.js';

  let roots = [];
  let expanded = new Set();
  let loaded = {};
  let selectedPath = '';
  let history = [];
  let historyIndex = -1;
  let currentRows = [];
  let sortBy = 'isDir';
  let sortDesc = false;
  let relativeTime = true;
  let filterText = '';
  let loadingRoots = true;
  let loadingRows = false;
  let treeError = '';
  let tableError = '';

  const headers = [
    { field: 'base', label: 'Name', width: '47%' },
    { field: 'isDir', label: 'Type', width: '8%' },
    { field: 'contents', label: 'Contents', width: '12%' },
    { field: 'size', label: 'Size', width: '10%' },
    { field: 'modifiedAt', label: 'Modified', width: '13%' },
  ];

  function apiUrl(key, fallback) {
    return IndexerApi[key] || fallback;
  }

  function toast(message) {
    if (!message) return;
    showToast(String(message));
  }

  function relativeTimeButtonText(enabled) {
    return 'Relative Time: ' + (enabled ? 'On' : 'Off');
  }

  function sortHeaderText(label, field) {
    return label + (sortBy === field ? (sortDesc ? ' ↓' : ' ↑') : '');
  }

  function compareByField(a, b) {
    let av;
    let bv;
    switch (sortBy) {
      case 'base':
        av = a.base || '';
        bv = b.base || '';
        break;
      case 'contents':
        av = (a.fileCount || 0) + (a.dirCount || 0);
        bv = (b.fileCount || 0) + (b.dirCount || 0);
        break;
      case 'size':
        av = a.size || 0;
        bv = b.size || 0;
        break;
      case 'isDir':
        av = a.isDir ? 1 : 0;
        bv = b.isDir ? 1 : 0;
        break;
      case 'modifiedAt':
      default:
        av = a.modifiedAt || '';
        bv = b.modifiedAt || '';
        break;
    }
    if (av < bv) return sortDesc ? 1 : -1;
    if (av > bv) return sortDesc ? -1 : 1;
    return String(a.base || '').localeCompare(String(b.base || ''));
  }

  function parentDir(path) {
    const clean = String(path || '').trim().replace(/\/+$/, '');
    if (!clean) return '';
    const idx = clean.lastIndexOf('/');
    if (idx <= 0) return clean;
    return clean.slice(0, idx);
  }

  function browseTarget(path, isDir) {
    return Number(isDir) === 1 || isDir === true ? path : parentDir(path);
  }

  function needsPasswordPrompt() {
    const host = String(window.location.hostname || '').trim().toLowerCase();
    return !(host === 'localhost' || host === '127.0.0.1' || host === '::1');
  }

  async function getJSON(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!res.ok) throw new Error(text || ('HTTP ' + res.status));
    return text ? JSON.parse(text) : {};
  }

  function syncBrowseState() {
    window.dispatchEvent(new CustomEvent('indexer:browseState', {
      detail: {
        roots,
        selectedPath,
        history,
        historyIndex,
        currentRows,
        relativeTime,
        sortBy,
        sortDesc,
      }
    }));
  }

  async function reloadTree() {
    loadingRoots = true;
    treeError = '';
    expanded = new Set();
    loaded = {};
    selectedPath = '';
    history = [];
    historyIndex = -1;
    currentRows = [];
    syncBrowseState();
    try {
      const rows = await getJSON(apiUrl('browse', '/api/browse'));
      roots = Array.isArray(rows) ? rows : [];
      if (roots.length) {
        await selectPath(roots[0].path);
      }
    } catch (err) {
      roots = [];
      treeError = String(err?.message || err);
      toast(treeError);
    } finally {
      loadingRoots = false;
      syncBrowseState();
    }
  }

  async function toggleNode(path) {
    if (expanded.has(path)) {
      expanded = new Set([...expanded].filter(item => item !== path));
      return;
    }
    expanded = new Set([...expanded, path]);
    if (!loaded[path]) {
      try {
        const rows = await getJSON(apiUrl('browse', '/api/browse') + '?path=' + encodeURIComponent(path));
        loaded = { ...loaded, [path]: (rows || []).filter(item => item.isDir) };
      } catch (err) {
        toast(String(err?.message || err));
      }
    }
  }

  async function selectPath(path, options = {}) {
    const pushHistory = options.pushHistory !== false;
    if (pushHistory) {
      let nextHistory = history;
      let nextIndex = historyIndex;
      if (nextIndex < nextHistory.length - 1) {
        nextHistory = nextHistory.slice(0, nextIndex + 1);
      }
      if (nextHistory[nextHistory.length - 1] !== path) {
        nextHistory = [...nextHistory, path];
        nextIndex = nextHistory.length - 1;
      }
      history = nextHistory;
      historyIndex = nextIndex;
    }
    selectedPath = path;
    loadingRows = true;
    tableError = '';
    try {
      const rows = await getJSON(apiUrl('browse', '/api/browse') + '?path=' + encodeURIComponent(path));
      currentRows = Array.isArray(rows) ? rows : [];
    } catch (err) {
      currentRows = [];
      tableError = String(err?.message || err);
      toast(tableError);
    } finally {
      loadingRows = false;
      syncBrowseState();
    }
  }

  function setSort(field) {
    if (sortBy === field) {
      sortDesc = !sortDesc;
    } else {
      sortBy = field;
      sortDesc = false;
    }
    syncBrowseState();
  }

  function browseUp() {
    const parent = parentDir(selectedPath);
    if (!parent || parent === selectedPath) return;
    selectPath(parent);
  }

  function browseBack() {
    if (historyIndex <= 0) return;
    historyIndex -= 1;
    selectPath(history[historyIndex], { pushHistory: false });
  }

  function browseForward() {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1;
    selectPath(history[historyIndex], { pushHistory: false });
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

  async function openExternal(path, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      const url = new URL(apiUrl('open', '/api/open'), window.location.origin);
      url.searchParams.set('path', path || '');
      const res = await getJSON(url.toString());
      toast(res?.message || 'Opened file');
    } catch (err) {
      toast('Open failed: ' + err);
    }
  }

  async function renameFromBrowse(path) {
    const oldPath = String(path || '').trim();
    if (!oldPath) {
      toast('Rename path is required');
      return;
    }
    const nextPath = window.prompt('Rename to path', oldPath);
    if (!nextPath) return;
    let password = '';
    if (needsPasswordPrompt()) {
      password = window.prompt('Manage password?') || '';
      if (!password) {
        toast('Password is required');
        return;
      }
    }
    try {
      const res = await getJSON(apiUrl('rename', '/api/rename'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          oldPath,
          newPath: nextPath,
          confirm: 'CONFIRM',
        }),
      });
      toast(res?.message || 'Renamed');
      await selectPath(selectedPath || parentDir(oldPath), { pushHistory: false });
    } catch (err) {
      toast(String(err?.message || err));
    }
  }

  async function showInBrowse(path, isDir, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const target = browseTarget(path, isDir);
    if (!target) {
      toast('No browse target for this row');
      return;
    }
    setActiveTab('browse', localStorage);
    window.dispatchEvent(new CustomEvent('indexer:tab', { detail: { tab: 'browse' } }));
    await selectPath(target);
  }

  function handleBrowseCommand(event) {
    const detail = event?.detail || {};
    switch (detail.kind) {
      case 'reload':
        reloadTree();
        break;
      case 'toggleNode':
        if (detail.path) toggleNode(detail.path);
        break;
      case 'selectPath':
        if (detail.path) selectPath(detail.path, detail.options || {});
        break;
      case 'show':
        showInBrowse(detail.path || '', detail.isDir, null);
        break;
      case 'up':
        browseUp();
        break;
      case 'back':
        browseBack();
        break;
      case 'forward':
        browseForward();
        break;
    }
  }

  $: maxRootBytes = roots.reduce((mx, root) => Math.max(mx, Number(root.size || 0)), 0);
  $: filteredRows = currentRows
    .filter(item => {
      const filter = filterText.trim().toLowerCase();
      if (!filter) return true;
      return String(item.base || '').toLowerCase().includes(filter);
    })
    .slice()
    .sort(compareByField);

  onMount(() => {
    window.addEventListener('indexer:browseCommand', handleBrowseCommand);
    reloadTree();
  });

  onDestroy(() => {
    window.removeEventListener('indexer:browseCommand', handleBrowseCommand);
  });
</script>

<section id="tab-browse" class:active={$activeTab === 'browse'} class="tabPane">
  <div class="workspace">
    <div class="treePane">
      <div class="treeHeader">
        <h2>Roots</h2>
        <div class="row" style="margin:0">
          <button class="ghost" onclick={reloadTree}>Reload</button>
        </div>
      </div>
      <div class="treeScroll">
        {#if treeError}
          <div class="empty">{treeError}</div>
        {:else if loadingRoots}
          <div class="empty">Loading roots...</div>
        {:else if !roots.length}
          <div class="empty">No configured roots</div>
        {:else}
          {#each roots as root}
            <BrowseTreeNode
              item={root}
              depth={0}
              {expanded}
              {loaded}
              {selectedPath}
              {maxRootBytes}
              onSelect={selectPath}
              onToggle={toggleNode}
              {formatBytesHtml}
            />
          {/each}
        {/if}
      </div>
    </div>
    <div class="resultPane">
      <div class="resultHeader">
        <div>
          <h2>Directory Listing</h2>
          <div class="mono" style="color:var(--muted); margin-top:4px">{selectedPath || ''}</div>
        </div>
        <div class="row" style="margin:0">
          <button class="ghost" onclick={browseBack} disabled={historyIndex <= 0}>Back</button>
          <button class="ghost" onclick={browseForward} disabled={historyIndex < 0 || historyIndex >= history.length - 1}>Forward</button>
          <button class="ghost" onclick={browseUp}>Up</button>
          <input bind:value={filterText} placeholder="Filter by name" style="max-width:180px">
          <button class="ghost" onclick={() => (relativeTime = !relativeTime)}>{relativeTimeButtonText(relativeTime)}</button>
        </div>
      </div>
      <div class="resultScroll">
        <table style="table-layout:fixed">
          <thead>
            <tr>
              {#each headers as header}
                <th class="clickable" style={`width:${header.width}`} onclick={() => setSort(header.field)}>{sortHeaderText(header.label, header.field)}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#if tableError}
              <tr><td colspan="5" class="empty">{tableError}</td></tr>
            {:else if loadingRows}
              <tr><td colspan="5" class="empty">Loading directory...</td></tr>
            {:else if !filteredRows.length}
              <tr><td colspan="5" class="empty">Empty directory</td></tr>
            {:else}
              {#each filteredRows as item}
                <tr ondblclick={() => item.isDir && selectPath(item.path || '')}>
                  <td>
                    <div class="nameCell">
                      <span class="nameLabel cellEllipsis" title={item.path || ''}>{item.base || ''}</span>
                      <span class="rowActions">
                        <button class="ghost iconBtn" title={item.path || ''} onclick={(event) => copyPath(item.path || '', event)}>⧉</button>
                        <button class="ghost iconBtn" title="Rename" onclick={() => renameFromBrowse(item.path || '')}>✎</button>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="typeCell">
                      <span class={`pill ${item.isDir ? 'pillDir' : 'pillFile'}`}>{item.isDir ? 'DIR' : 'FILE'}</span>
                      <button class="ghost iconBtn" title="Open externally" onclick={(event) => openExternal(item.path || '', event)}>⤴</button>
                      {#if item.isDir}
                        <button class="ghost iconBtn" title="Open directory" onclick={() => selectPath(item.path || '')}>↗</button>
                      {/if}
                    </span>
                  </td>
                  <td>
                    {#if item.isDir}
                      <span class="fdFile tooltipish" title="descendant files">{item.fileCount || 0} F</span>
                      <span class="fdDir tooltipish" title="descendant directories">{item.dirCount || 0} D</span>
                    {:else}
                      <span class="fdFile">1 F</span>
                    {/if}
                  </td>
                  <td>{@html formatBytesHtml(item.size || 0)}</td>
                  <td class="mono">{@html formatAgeByMode(item.modifiedAt || '', relativeTime)}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>
