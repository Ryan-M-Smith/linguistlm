"use client";

import { useEffect, useRef } from "react";
import type { GrammarError } from "@/lib/highlight";
import { getHighlightedHtml } from "@/lib/highlight";

export function Highlighter({
	value,
	errors,
	ignoredKeys,
	onChange,
	className,
	style,
	placeholder,
}: {
	value: string;
	errors: GrammarError[];
	ignoredKeys: Set<string>;
	onChange: (next: string) => void;
	className?: string;
	style?: React.CSSProperties;
	placeholder?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const pendingCaretOffset = useRef<number | null>(null);

	// Ensure placeholder CSS is present once
	useEffect(() => {
		const id = 'llm-ce-placeholder-style';
		if (!document.getElementById(id)) {
			const style = document.createElement('style');
			style.id = id;
			style.textContent = `
.llm-ce-placeholder:empty:before {
	content: attr(data-placeholder);
	color: inherit;
	opacity: 0.6;
	pointer-events: none;
	white-space: pre-wrap;
}
`;
			document.head.appendChild(style);
		}
	}, []);

	// Sync HTML + restore caret
	useEffect(() => {
		const el = ref.current; if (!el) return;
		const html = getHighlightedHtml(value, errors, ignoredKeys);
		if (el.innerHTML === html) return;

		let selection = window.getSelection();
		let range: Range | null = null;
		let caretOffset = 0;
		if (pendingCaretOffset.current != null) {
			caretOffset = pendingCaretOffset.current;
		} else if (selection && selection.rangeCount > 0 && el.contains(selection.anchorNode)) {
			range = selection.getRangeAt(0);
			const pre = range.cloneRange();
			pre.selectNodeContents(el);
			pre.setEnd(range.endContainer, range.endOffset);
			caretOffset = pre.toString().length;
		}

		el.innerHTML = html;

		if (range || pendingCaretOffset.current != null) {
			let chars = 0;
			let found = false;
			const setCaret = (node: Node): boolean => {
				if (found) return true;
				if (node.nodeType === Node.TEXT_NODE) {
					const len = (node.textContent || "").length;
					if (chars + len >= caretOffset) {
						const sel = window.getSelection();
						if (sel) {
							const r = document.createRange();
							r.setStart(node, caretOffset - chars);
							r.collapse(true);
							sel.removeAllRanges();
							sel.addRange(r);
						}
						found = true; return true;
					}
					chars += len;
				} else {
					for (let i=0;i<node.childNodes.length;i++) if (setCaret(node.childNodes[i])) return true;
				}
				return false;
			};
			setCaret(el);
			pendingCaretOffset.current = null;
		}
	}, [value, errors, ignoredKeys]);

	return (
		<div
			ref={ref}
			className={`${className ?? ''} llm-ce-placeholder`}
			style={style}
			contentEditable
			spellCheck
			data-placeholder={placeholder || undefined}
			onInput={(e) => {
				const text = (e.target as HTMLDivElement).innerText;
				onChange(text);
			}}
			suppressContentEditableWarning
		/>
	);
}
