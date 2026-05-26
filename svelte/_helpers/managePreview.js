import { escapeHtml, valueOrDash } from './xFormatter.js';

export function renderSuggestionCards(res, title) {
    const s = res.suggestion || {}
    return '<div class="previewLabel">' + escapeHtml(title || 'Suggestion') + '</div>' +
      '<div class="previewList">' +
        '<div class="previewItem"><div class="previewLabel">Rule Source</div><div class="mono">' + valueOrDash(s.ruleSource || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Original</div><div class="mono">' + valueOrDash(res.current || s.original || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Normalized Tokens</div><div class="mono">' + valueOrDash(s.normalized || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Clean Title Rule</div><div class="mono">' + valueOrDash(s.cleanTitle || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Season Rule</div><div class="mono">' + valueOrDash(s.season || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Year Rule</div><div class="mono">' + valueOrDash(s.year || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Episode Rule</div><div class="mono">' + valueOrDash(s.episode || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Extras Rule</div><div class="mono">' + valueOrDash(s.extras || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Final Suggestion</div><div class="mono">' + valueOrDash(res.suggested || s.suggested || '') + '</div></div>' +
        '<div class="previewItem"><div class="previewLabel">Target Path</div><div class="mono">' + valueOrDash(res.newPath || '') + '</div></div>' +
      '</div>'
}

export const IndexerManagePreview = {
  renderSuggestionCards,
};
