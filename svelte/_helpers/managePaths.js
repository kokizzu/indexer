export function pathRootAndRelative(path, roots) {
    const cleanPath = String(path || '').trim()
    const values = (roots || []).map(root => root.path).filter(Boolean)
    for (const root of values) {
      if (cleanPath === root) return { root, rel: '' }
      if (cleanPath.startsWith(root + '/')) return { root, rel: cleanPath.slice(root.length + 1) }
    }
    return { root: values[0] || '', rel: cleanPath }
  }

export function buildManagePath(root, rel) {
    const cleanRoot = String(root || '').trim().replace(/\/+$/, '')
    const cleanRel = String(rel || '').trim().replace(/^\/+/, '')
    if (!cleanRoot) return cleanRel
    if (!cleanRel) return cleanRoot
    return cleanRoot + '/' + cleanRel
  }

export function renameTargetFromSource(path) {
    const clean = String(path || '')
    const base = clean.split('/').filter(Boolean).pop() || ''
    return base ? clean.slice(0, clean.length - base.length) : clean
  }

export function nextSelectedSource(currentSelectedSource, browseSelectedPath) {
    return currentSelectedSource || browseSelectedPath || ''
  }

export const IndexerManagePaths = {
  pathRootAndRelative,
  buildManagePath,
  renameTargetFromSource,
  nextSelectedSource,
};
