import IndexerApi from '../jsApi.GEN.js';
import { escapeHtml } from './xFormatter.js';

export function buildManagePlan(action, values) {
    if (action === 'rename') {
      if (!values.path) throw new Error('Directory path is required')
      if (!values.newPath) throw new Error('Rename target path is required')
      return {
        action,
        title: 'Rename Directory',
        subtitle: values.path,
        endpoint: IndexerApi.rename,
        body: { oldPath: values.path, newPath: values.newPath, confirm: 'CONFIRM' },
        items: [
          ['Action', 'Rename directory'],
          ['From', values.path],
          ['To', values.newPath]
        ]
      }
    }
    if (action === 'move') {
      if (!values.path) throw new Error('Source path is required')
      if (!values.dstRoot) throw new Error('Destination root is required')
      const dstDir = values.dstSubdir ? (values.dstRoot.replace(/\/+$/, '') + '/' + values.dstSubdir) : values.dstRoot
      const dstPath = dstDir.replace(/\/+$/, '') + '/' + (values.path.split('/').pop() || '')
      return {
        action,
        title: 'Move Path',
        subtitle: values.path,
        endpoint: IndexerApi.move,
        body: { srcPath: values.path, dstDir, confirm: 'CONFIRM' },
        items: [
          ['Action', 'Move path'],
          ['From', values.path],
          ['Destination Dir', dstDir],
          ['Result Path', dstPath]
        ]
      }
    }
    if (!values.path) throw new Error('Delete path is required')
    return {
      action,
      title: 'Delete Path',
      subtitle: values.path,
      endpoint: IndexerApi.delete,
      body: { path: values.path, confirm: 'CONFIRM' },
      items: [
        ['Action', 'Delete path'],
        ['Target', values.path]
      ]
    }
  }

export function renderManagePlanHtml(plan) {
    return '<div class="previewLabel">' + escapeHtml(plan.title) + '</div>' +
      '<div class="previewList">' +
        plan.items.map(([label, value]) =>
          '<div class="previewItem"><div class="previewLabel">' + escapeHtml(label) + '</div><div class="mono">' + escapeHtml(value) + '</div></div>'
        ).join('') +
      '</div>'
  }

export function renderManageModalBodyHtml(plan) {
    return plan.items.map(([label, value]) =>
      '<div class="previewItem"><div class="previewLabel">' + escapeHtml(label) + '</div><div class="mono">' + escapeHtml(value) + '</div></div>'
    ).join('')
  }

export function renderSubtitleSuggestionHtml(res, fallbackPath) {
    return '<div class="previewLabel">Subtitle Rename Suggestion</div>' +
      '<div class="previewList">' +
        '<div class="previewItem"><div class="previewLabel">From</div><div class="mono">' + escapeHtml(res.path || fallbackPath) + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Suggested</div><div class="mono">' + escapeHtml(res.suggested || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">To</div><div class="mono">' + escapeHtml(res.newPath || '') + '</div></div>' +
      '</div>'
  }

export const IndexerManageActions = {
  buildManagePlan,
  renderManagePlanHtml,
  renderManageModalBodyHtml,
  renderSubtitleSuggestionHtml,
};
