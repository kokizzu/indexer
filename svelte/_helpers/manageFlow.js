import IndexerApi from '../jsApi.GEN.js';

export async function collectManageDirectories(getJSON, rootPath, limit) {
    const queue = [rootPath]
    const out = []
    const seen = new Set()
    while (queue.length && out.length < limit) {
      const current = queue.shift()
      if (!current || seen.has(current)) continue
      seen.add(current)
      const rows = await getJSON(IndexerApi.browse + '?path=' + encodeURIComponent(current))
      for (const item of (rows || [])) {
        if (!item || !item.isDir) continue
        out.push(item)
        if (out.length >= limit) break
        queue.push(item.path)
      }
    }
    return out
  }

export async function collectManageEntries(getJSON, rootPath, limit) {
    const queue = [rootPath]
    const out = []
    const seen = new Set()
    while (queue.length && out.length < limit) {
      const current = queue.shift()
      if (!current || seen.has(current)) continue
      seen.add(current)
      const rows = await getJSON(IndexerApi.browse + '?path=' + encodeURIComponent(current))
      for (const item of (rows || [])) {
        if (!item) continue
        out.push(item)
        if (out.length >= limit) break
        if (item.isDir) queue.push(item.path)
      }
    }
    return out
  }

export async function scanSuggestedRows({ getJSON, postJSON, rootPath, limit, mode, buildSuggestedScanRow }) {
    const dirs = await collectManageDirectories(getJSON, rootPath, limit)
    const rows = []
    for (const item of dirs) {
      try {
        const res = await postJSON(getJSON, IndexerApi.suggest, { path: item.path })
        const row = buildSuggestedScanRow(item, res, mode)
        if (row) rows.push(row)
      } catch (_) {}
    }
    return rows
  }

export async function scanDeleteRows({ getJSON, rootPath, limit, buildDeleteScanRows }) {
    const rows = await collectManageEntries(getJSON, rootPath, limit)
    return buildDeleteScanRows(rows)
  }

export const IndexerManageFlow = {
  collectManageDirectories,
  collectManageEntries,
  scanSuggestedRows,
  scanDeleteRows,
};
