export type GrammarError = { start: number; end: number; error: string; suggestion: string };

export function escapeHtml(str: string) {
	return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
}

export function getHighlightedHtml(text: string, errors: GrammarError[], ignoredKeys: Set<string>): string {
	if (!errors || errors.length === 0) return escapeHtml(text);
	let result = "";
	let lastIdx = 0;
	errors
		.filter((er) => !ignoredKeys.has(`${er.start}-${er.end}-${er.error}`))
		.sort((a, b) => a.start - b.start);
	for (const err of errors) {
		result += escapeHtml(text.slice(lastIdx, err.start));
		const errorMsg = escapeHtml(err.error).replace(/\"/g, '&quot;');
		const suggestionMsg = escapeHtml(err.suggestion).replace(/\"/g, '&quot;');
		result +=
			`<span class=\"highlight-tooltip\" data-start=\"${err.start}\" data-end=\"${err.end}\" data-error=\"${errorMsg}\" data-suggestion=\"${suggestionMsg}\" style=\"background:#fbbf24;color:#000;padding:0 2px;border-radius:3px;position:relative;text-decoration:underline;text-decoration-style:wavy;text-decoration-color:#d97706;text-underline-offset:2px;\">` +
			escapeHtml(text.slice(err.start, err.end)) +
			"</span>";
		lastIdx = err.end;
	}
	result += escapeHtml(text.slice(lastIdx));
	return result;
}
