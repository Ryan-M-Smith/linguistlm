"use client";

import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";

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

	const handleExplain = async (d: { start?: number; end?: number; error: string; span?: string }) => {
		const snippet = d.span || (typeof d.start === 'number' && typeof d.end === 'number' ? textValue.slice(d.start, d.end) : "");
		const prompt = `Explain the following grammar issue clearly and concisely with the rule and 1-2 short examples.\n\nSelected text: "${snippet}"\nReported issue: ${d.error}`;
		await chatRef.current?.send(prompt);
	};

	const handleAcceptAll = () => {
		const visibleErrors = errors
			.filter((er) => !ignoredKeys.has(`${er.start}-${er.end}-${er.error}`))
			.sort((a, b) => a.start - b.start);
		
		if (visibleErrors.length === 0) return;

		// Apply all corrections from right to left to keep indices valid
		let newText = textValue;
		for (let i = visibleErrors.length - 1; i >= 0; i--) {
			const er = visibleErrors[i];
			const start = Math.max(0, Math.min(er.start, newText.length));
			const end = Math.max(start, Math.min(er.end, newText.length));
			newText = newText.slice(0, start) + er.suggestion + newText.slice(end);
		}
		
		setTextValue(newText);
		setErrors([]);
		// Request fresh corrections after applying all
		requestCorrections(newText);
	};

	const visibleErrorCount = errors.filter((er) => !ignoredKeys.has(`${er.start}-${er.end}-${er.error}`)).length;

	return (
		<>
		<TooltipPortal onExplain={handleExplain}/>
		<div className="flex justify-center w-full h-full overflow-hidden">
			<div className="flex gap-x-4 w-[90%] p-4 h-full min-h-0 flex-col">
				<div className="flex gap-x-4 flex-1 min-h-0">
					<div className="flex-1 min-w-0 h-full relative">
						<Highlighter
							value={textValue}
							errors={errors}
							ignoredKeys={ignoredKeys}
							onChange={setTextValue}
							placeholder="Write or paste your text here..."
							className={`
								absolute inset-0 w-full h-full p-8 border-4 dark:bg-default-100 dark:border-llm-chinois
								bg-llm-blue-flower/10 border-llm-masala rounded-xl text resize-none outline-none text-sm
								placeholder:opacity-60 font-sans whitespace-pre-wrap wrap-break-word focus:outline-none
								dark:text-llm-lace text-llm-masala
							`}
							style={{
								fontSize: "1rem",
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

				{/* Action buttons at the bottom */}
				{visibleErrorCount > 0 && (
					<div className="flex gap-3 justify-center items-center py-2">
						<span className="text-sm dark:text-llm-lace text-llm-masala">
							{visibleErrorCount} issue{visibleErrorCount !== 1 ? 's' : ''} found
						</span>
						<Button
							size="sm"
							className="bg-green-600 text-white hover:bg-green-700"
							onPress={handleAcceptAll}
						>
							Accept All
						</Button>
					</div>
				)}
			</div>
		</div>
		</>
	);
}