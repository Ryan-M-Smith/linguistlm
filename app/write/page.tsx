"use client";

import { JSX, useCallback, useEffect, useRef, useState } from "react";

import ChatBox, { ChatBoxHandle } from "@/components/chatbox";
import type { GrammarError } from "@/lib/highlight";
import { Highlighter } from "@/components/highlighter";
import { TooltipPortal } from "@/components/tooltip-portal";

export default function Write(): JSX.Element {
    const [textValue, setTextValue] = useState("");
    const [errors, setErrors] = useState<GrammarError[]>([]);
    const [ignoredKeys, setIgnoredKeys] = useState<Set<string>>(new Set());
    const chatRef = useRef<ChatBoxHandle | null>(null);
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const prevTextRef = useRef<string>("");
	const lastImmediateAt = useRef<number>(0);

	const requestCorrections = useCallback(async (text: string) => {
		if (!text?.trim()) { setErrors([]); return; }
		// Abort any in-flight request
		if (abortRef.current) abortRef.current.abort();
		const ac = new AbortController();
		abortRef.current = ac;
		try {
			const response = await fetch("/api/corrections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: text }),
				signal: ac.signal,
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const data = await response.json();
			console.log(data);
			setErrors(Array.isArray(data?.errors) ? data.errors : []);
		} catch (err: any) {
			if (err?.name === "AbortError") return; // ignore aborted
			// Optionally surface error state; for now, clear to avoid stale highlights
			setErrors([]);
		}
	}, []);

	// Debounced correction detection with request cancellation (more fluid)
	useEffect(() => {
		if (debounceTimer.current) clearTimeout(debounceTimer.current);
		if (!textValue?.trim()) { setErrors([]); if (abortRef.current) abortRef.current.abort(); prevTextRef.current = textValue; return; }

		// Heuristic: trigger immediately on word boundary characters (space, punctuation)
		const prev = prevTextRef.current || "";
		const now = textValue;
		const immediate = (() => {
			if (now.length <= prev.length) return false; // deletions use debounce
			const ch = now[now.length - 1];
			// Treat whitespace or punctuation boundaries as immediate triggers
			return /[\s\.,!?:;\)\]\}]/.test(ch);
		})();

		// Throttle immediate triggers to at most every 200ms
		const nowTs = Date.now();
		if (immediate && nowTs - lastImmediateAt.current > 200) {
			lastImmediateAt.current = nowTs;
			requestCorrections(textValue);
		} else {
			// Faster debounce for responsiveness
			debounceTimer.current = setTimeout(() => { requestCorrections(textValue); }, 250);
		}
		prevTextRef.current = textValue;
		return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
	}, [textValue, requestCorrections]);

	// Removed unused SendButton for a cleaner UI; can be re-added if needed

	// Handlers used by TooltipPortal
	const handleAccept = (d: { start: number; end: number; suggestion: string; error?: string; span?: string }) => {
		// Adjust the range to guard against stale indices by matching the original span nearby
		const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
		const len = textValue.length;
		let start = clamp(d.start ?? 0, 0, len);
		let end = clamp(d.end ?? start, 0, len);
		const insert = d.suggestion ?? ""; // allow deletions
		const original = d.span ?? textValue.slice(start, end);

	// If the current slice doesn't match the original, try to find the best occurrence near the original start
		const currentSlice = textValue.slice(start, end);
		if (original && currentSlice !== original) {
			// Search in a window around the intended start
			const windowRadius = 64;
			const winStart = clamp(start - windowRadius, 0, len);
			const winEnd = clamp(start + windowRadius, 0, len);
			const windowText = textValue.slice(winStart, winEnd);
			const idxRel = windowText.indexOf(original);
			if (idxRel !== -1) {
				start = winStart + idxRel;
				end = start + original.length;
			} else {
				// Fallback: first global occurrence, prefer closest to original start
				let bestIdx = -1;
				let searchIdx = 0;
				while (true) {
					const found = textValue.indexOf(original, searchIdx);
					if (found === -1) break;
					if (bestIdx === -1 || Math.abs(found - start) < Math.abs(bestIdx - start)) bestIdx = found;
					searchIdx = found + 1;
				}

				// Expand to token boundaries (single word) if the selection sits in the middle of a word
				const isWordChar = (ch: string) => /[A-Za-z0-9']/ .test(ch);
				const onlyWordChars = (s: string) => /^[A-Za-z0-9']+$/.test(s);
				if (onlyWordChars(original)) {
					let left = start; let right = end;
					while (left > 0 && isWordChar(textValue[left - 1])) left--;
					while (right < len && isWordChar(textValue[right])) right++;
					start = left; end = right;
				}

				// If suggestion contains spaces and original likely spans across words, expand across adjacent word tokens
				if (insert.indexOf(" ") >= 0 && end < len) {
					let r = end;
					while (r < len && (textValue[r] === ' ' || isWordChar(textValue[r]))) r++;
					end = r;
				}
				if (bestIdx !== -1) {
					start = bestIdx;
					end = bestIdx + original.length;
				}
			}
		}
		if (typeof d.start === 'number' && typeof d.end === 'number' && d.error) {
			setIgnoredKeys((prev) => { const next = new Set(prev); next.add(`${d.start}-${d.end}-${d.error}`); return next; });
		}
		const newText = textValue.slice(0, start) + insert + textValue.slice(end);
		setTextValue(newText);

		// Update existing error ranges in-place so only the accepted one disappears
		// and the rest stay visible until fresh results arrive.
		const acceptedKey = `${d.start}-${d.end}-${d.error ?? ""}`;
		const delta = insert.length - (end - start);
		setErrors((prev) => {
			const list = prev || [];
			// Try remove by exact key; if not found, remove the closest span match
			const byKeyIdx = list.findIndex((er) => `${er.start}-${er.end}-${er.error}` === acceptedKey);
			let dropIdx = byKeyIdx;
			if (dropIdx === -1 && original) {
				let bestIdx = -1; let bestDist = Infinity;
				for (let i = 0; i < list.length; i++) {
					const er = list[i];
					const slice = textValue.slice(er.start, er.end);
					if (slice === original) {
						const dist = Math.abs(er.start - (d.start ?? er.start));
						if (dist < bestDist) { bestDist = dist; bestIdx = i; }
					}
				}
				dropIdx = bestIdx;
			}
			const next = list.filter((_, i) => i !== dropIdx);
			return next.map((er) => {
				// shift ranges that start after the replaced segment
				if (er.start >= end) return { ...er, start: er.start + delta, end: er.end + delta };
				// if overlap with the replaced region, conservatively drop or clamp
				if (er.end > start && er.start < end) {
					// clamp to avoid highlighting inside the replaced text
					const ns = er.start;
					const ne = Math.max(ns, start);
					if (ne - ns < 1) return { ...er, start: end + (er.start - start) + delta, end: end + (er.start - start) + delta }; // minimal fallback
				}
				return er;
			});
		});

		// Kick off a fresh analysis for accuracy
		requestCorrections(newText);
	};
	const handleDismiss = (d: { start: number; end: number; error: string }) => {
		setIgnoredKeys((prev) => { const next = new Set(prev); next.add(`${d.start}-${d.end}-${d.error}`); return next; });
		// On dismiss, refetch to ensure any dependent suggestions adjust to unchanged text
		requestCorrections(textValue);
	};

	const handleExplain = async (d: { start?: number; end?: number; error: string; span?: string }) => {
		const snippet = d.span || (typeof d.start === 'number' && typeof d.end === 'number' ? textValue.slice(d.start, d.end) : "");
		const prompt = `Explain the following grammar issue clearly and concisely with the rule and 1-2 short examples.\n\nSelected text: "${snippet}"\nReported issue: ${d.error}`;
		await chatRef.current?.send(prompt);
	};

	return (
		<>
		{/* Tooltip manager */}
		<TooltipPortal onAccept={handleAccept} onDismiss={handleDismiss} onExplain={handleExplain}/>
		<div className="flex justify-center w-full h-full overflow-hidden">
			<div className="flex gap-x-4 w-[90%] p-4 h-full min-h-0">
				<div className="flex-1 min-w-0 h-full relative">
					<Highlighter
						value={textValue}
						errors={errors}
						ignoredKeys={ignoredKeys}
						onChange={setTextValue}
						placeholder="Write or paste your text here…"
						className={`
							absolute inset-0 w-full h-full p-8 border-4 dark:bg-default-100 dark:border-llm-chinois
							bg-llm-blue-flower/10 border-llm-masala rounded-xl text resize-none outline-none text-sm
							placeholder:opacity-60 font-sans whitespace-pre-wrap wrap-break-word focus:outline-none
						`}
						style={{
							fontSize: "1rem",
							color: typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
								? "#302c2a"
								: "#f3f3e7",
							fontFamily: "inherit",
							lineHeight: 1.5,
							letterSpacing: "normal",
							zIndex: 2,
							minHeight: "100%",
							maxHeight: "100%",
							overflow: "auto",
						}}
					/>
				</div>

				<ChatBox ref={chatRef} endpoint="/api/explainations"/>
			</div>
		</div>
		</>
	);
}