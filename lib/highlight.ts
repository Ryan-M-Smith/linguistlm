export type GrammarError = { start: number; end: number; error: string; suggestion: string };

export function escapeHtml(str: string) {
	return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
}

export function getHighlightedHtml(text: string, errors: GrammarError[], ignoredKeys: Set<string>): string {
	if (!errors || errors.length === 0) return escapeHtml(text);
	// Filter out ignored, sort by start
	const visible = errors
		.filter((er) => !ignoredKeys.has(`${er.start}-${er.end}-${er.error}`))
		.sort((a, b) => a.start - b.start);
	if (visible.length === 0) return escapeHtml(text);

	let result = "";
	let lastIdx = 0;
	const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

	for (const err of visible) {
		const rawS = clamp(err.start, 0, text.length);
		const rawE = clamp(err.end, 0, text.length);
		if (rawE <= lastIdx) continue; // overlapping or out-of-order safety
		const start = Math.max(lastIdx, rawS);
		const end = Math.max(start, rawE);
		// Add plain text before the highlight
		result += escapeHtml(text.slice(lastIdx, start));
		// Build the highlight span with tooltip data
		const errorMsg = escapeHtml(err.error).replace(/\"/g, '&quot;');
		const suggestionMsg = escapeHtml(err.suggestion).replace(/\"/g, '&quot;');
		const spanText = escapeHtml(text.slice(start, end));
		result +=
			`<span class=\"highlight-tooltip\" data-start=\"${start}\" data-end=\"${end}\" data-error=\"${errorMsg}\" data-suggestion=\"${suggestionMsg}\" style=\"background:#fbbf24;color:#000;padding:0 2px;border-radius:3px;position:relative;text-decoration:underline;text-decoration-style:wavy;text-decoration-color:#d97706;text-underline-offset:2px;\">` +
			spanText +
			"</span>";
		lastIdx = end;
	}
	// Remainder after last highlight
	result += escapeHtml(text.slice(lastIdx));
	return result;
}
