<script>
  export let item;
  export let depth = 0;
  export let expanded;
  export let loaded;
  export let selectedPath = '';
  export let maxRootBytes = 0;
  export let onSelect = () => {};
  export let onToggle = () => {};
  export let formatBytesHtml = bytes => String(bytes || 0);

  function fdCounts(entry) {
    if (entry?.isDir) {
      return `${entry.fileCount || 0} F • ${entry.dirCount || 0} D`;
    }
    return '1 F';
  }

  $: path = item?.path || '';
  $: isExpanded = expanded?.has?.(path);
  $: children = loaded?.[path] || [];
  $: isActive = selectedPath === path;
  $: rootPct = depth === 0 && maxRootBytes > 0 ? ((Number(item?.size || 0) / maxRootBytes) * 100) : 0;
</script>

<div class="treeNode">
  <div class:active={isActive} class="treeRow" onclick={() => onSelect(path)}>
    <span class="treeIndent" style={`width:${depth * 14}px`}></span>
    <span class="twisty" onclick={(event) => { event.stopPropagation(); onToggle(path); }}>{isExpanded ? '▾' : '▸'}</span>
    <span class="treeName">{item?.base || ''}</span>
    <span class="treeMeta">
      {#if item?.isDir}
        {fdCounts(item)} •
      {/if}
      {@html formatBytesHtml(item?.size || 0)}
    </span>
  </div>
  {#if depth === 0}
    <div class="progressBar" style="margin:4px 0 6px 28px">
      <div class="progressFill" style={`width:${rootPct.toFixed(2)}%`}></div>
    </div>
  {/if}
  {#if isExpanded}
    <div class="children">
      {#each children as child}
        <svelte:self
          item={child}
          depth={depth + 1}
          {expanded}
          {loaded}
          {selectedPath}
          {maxRootBytes}
          {onSelect}
          {onToggle}
          {formatBytesHtml}
        />
      {/each}
    </div>
  {/if}
</div>
