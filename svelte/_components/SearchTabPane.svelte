<script>
  import { activeTab, setActiveTab } from '../_states/activeTab.js';
  import IndexerApi from '../jsApi.GEN.js';
  import { showToast } from '../_helpers/xNotifier.js';
  import { escapeHtml, formatBytesHtml, formatAgeByMode as renderAgeByMode } from '../_helpers/xFormatter.js';

  let query = '';
  let dirChecked = true;
  let fileChecked = false;
  let filterText = '';
  let relativeTime = true;
  let rows = [];
  let total = 0;
  let page = 0;
  let pageSize = 100;
  let sortBy = 'modifiedAt';
  let sortDesc = true;
  let loading = false;
  let error = '';

  const headers = [
    { field: 'isDir', label: 'Type', width: '8%' },
    { field: 'base', label: 'Name', width: '45%' },
    { field: 'root', label: 'Root', width: '16%' },
    { field: 'contents', label: 'Contents', width: '10%' },
    { field: 'size', label: 'Size', width: '9%' },
    { field: 'modifiedAt', label: 'Modified', width: '12%' },
  ];

  function apiUrl(key, fallback) {
    return IndexerApi[key] || fallback;
  }

  function toast(message) {
    if (!message) return;
    showToast(String(message));
  }

  function renderAge(value, useRelative) {
    return renderAgeByMode(value || '', useRelative) || escapeHtml(value || '');
  }

  function searchRelativeTimeTitle(enabled) {
    return 'Relative time: ' + (enabled ? 'On' : 'Off');
  }

  function sortHeaderText(label, field) {
    return label + (sortBy === field ? (sortDesc ? ' ↓' : ' ↑') : '');
  }

  function currentSearchKind() {
    if (dirChecked && fileChecked) return 'all';
    if (fileChecked) return 'file';
    return 'dir';
  }

  function compareByField(a, b) {
    let av;
    let bv;
    switch (sortBy) {
      case 'base':
        av = a.base || '';
        bv = b.base || '';
        break;
      case 'root':
        av = (a.rootKind || '') + '/' + (a.root || '');
        bv = (b.rootKind || '') + '/' + (b.root || '');
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

  async function getJSON(url) {
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || ('HTTP ' + res.status));
    }
    return text ? JSON.parse(text) : {};
  }

  async function runSearch(resetPage = false) {
    if (resetPage) page = 0;
    loading = true;
    error = '';
    try {
      const url = new URL(apiUrl('search', '/api/search'), window.location.origin);
      url.searchParams.set('q', query.trim());
      const kind = currentSearchKind();
      if (kind) url.searchParams.set('kind', kind);
      url.searchParams.set('limit', String(pageSize));
      url.searchParams.set('offset', String(page * pageSize));
      const res = await getJSON(url.toString());
      rows = Array.isArray(res?.rows) ? res.rows : [];
      total = Number(res?.total || 0);
    } catch (err) {
      rows = [];
      total = 0;
      error = String(err?.message || err);
      toast(error);
    } finally {
      loading = false;
    }
  }

  function toggleSearchKind(kind, checked) {
    if (kind === 'dir') {
      dirChecked = checked;
      if (!dirChecked && !fileChecked) fileChecked = true;
      return;
    }
    fileChecked = checked;
    if (!dirChecked && !fileChecked) dirChecked = true;
  }

  function setSort(field) {
    if (sortBy === field) {
      sortDesc = !sortDesc;
    } else {
      sortBy = field;
      sortDesc = false;
    }
  }

  function changePage(delta) {
    const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
    const nextPage = page + delta;
    if (nextPage < 0 || nextPage >= totalPages) return;
    page = nextPage;
    runSearch(false);
  }

  async function showInBrowse(path, isDir, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setActiveTab('browse', localStorage);
    window.dispatchEvent(new CustomEvent('indexer:tab', { detail: { tab: 'browse' } }));
    window.dispatchEvent(new CustomEvent('indexer:browseCommand', {
      detail: { kind: 'show', path: path || '', isDir: !!isDir }
    }));
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

  $: filteredRows = rows
    .filter(item => {
      const filter = filterText.trim().toLowerCase();
      if (!filter) return true;
      return String(item.base || '').toLowerCase().includes(filter) ||
        String(item.path || '').toLowerCase().includes(filter) ||
        String(item.root || '').toLowerCase().includes(filter);
    })
    .slice()
    .sort(compareByField);

  $: totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  $: pageInfo = `Page ${page + 1} / ${totalPages}`;
  $: countText = `${filteredRows.length} / ${total || filteredRows.length} rows`;
</script>

<section id="tab-search" class:active={$activeTab === 'search'} class="tabPane">
  <div class="card">
    <div class="cardInner">
      <div class="row singleRow">
        <input
          bind:value={query}
          placeholder="Search directory names and video filenames"
          onkeydown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            runSearch(true);
          }}
        >
        <div class="checkRow">
          <label class="checkInline"><input type="checkbox" checked={dirChecked} onchange={(event) => toggleSearchKind('dir', event.currentTarget.checked)}> directories</label>
          <label class="checkInline"><input type="checkbox" checked={fileChecked} onchange={(event) => toggleSearchKind('file', event.currentTarget.checked)}> video files</label>
        </div>
        <button class="secondary" onclick={() => runSearch(true)} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
      </div>
      <div class="resultPane" style="margin-top:16px">
        <div class="resultHeader">
          <div class="toolbarRow">
            <div class="toolbarGroup">
              <h2>Search Results</h2>
              <input bind:value={filterText} placeholder="Filter results" style="max-width:180px">
              <div class="toolbarMeta">{countText}</div>
            </div>
            <div class="toolbarGroup right">
              <div class="toolbarMeta">{pageInfo}</div>
              <button class="ghost iconBtn iconBtnWide" title={searchRelativeTimeTitle(relativeTime)} onclick={() => (relativeTime = !relativeTime)}>◷</button>
              <button class="ghost iconBtn iconBtnWide" title="Previous page" onclick={() => changePage(-1)} disabled={page <= 0}>‹</button>
              <button class="ghost iconBtn iconBtnWide" title="Next page" onclick={() => changePage(1)} disabled={page >= totalPages - 1}>›</button>
            </div>
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
              {#if error}
                <tr><td colspan="6" class="empty">{error}</td></tr>
              {:else if !filteredRows.length && !loading}
                <tr><td colspan="6" class="empty">No results</td></tr>
              {:else}
                {#each filteredRows as item}
                  <tr>
                    <td><span class={`pill ${item.isDir ? 'pillDir' : 'pillFile'}`}>{item.isDir ? 'DIR' : 'FILE'}</span></td>
                    <td>
                      <div class="nameCell">
                        <span class="nameLabel cellEllipsis" title={item.path || ''}>{item.base || ''}</span>
                        <span class="rowActions">
                          <button class="ghost iconBtn" title={item.path || ''} onclick={(event) => copyPath(item.path || '', event)}>⧉</button>
                          {#if !item.isDir}
                            <button class="ghost iconBtn" title="Open file externally" onclick={(event) => openExternal(item.path || '', event)}>⤴</button>
                          {/if}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span class="typeCell">
                        <span>{item.rootKind || ''} / {item.root || ''}</span>
                        <button class="ghost iconBtn" title="Show in Browse" onclick={(event) => showInBrowse(item.path || '', item.isDir, event)}>↗</button>
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
                    <td class="mono">{@html renderAge(item.modifiedAt || '', relativeTime)}</td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        <div class="toolbarRow" style="margin-top:12px">
          <div class="toolbarGroup right">
            <div class="toolbarMeta">{pageInfo}</div>
            <button class="ghost iconBtn iconBtnWide" title="Previous page" onclick={() => changePage(-1)} disabled={page <= 0}>‹</button>
            <button class="ghost iconBtn iconBtnWide" title="Next page" onclick={() => changePage(1)} disabled={page >= totalPages - 1}>›</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
