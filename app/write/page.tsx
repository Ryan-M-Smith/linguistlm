"use client";

import { JSX, useEffect, useState } from "react";
import { Highlighter } from "@/components/highlighter";
import { TooltipPortal } from "@/components/tooltip-portal";
import type { GrammarError } from "@/lib/highlight";
import ChatBox from "@/components/chatbox";

export default function Write(): JSX.Element {
	const [textValue, setTextValue] = useState("");
	const [errors, setErrors] = useState<GrammarError[]>([]);
	const [ignoredKeys, setIgnoredKeys] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (textValue === "") {
			setErrors([]);
			return;
		}

		const handler = setTimeout(async () => {
			const response = await fetch("/api/corrections", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query: textValue }),
			});

			const data = await response.json();
			console.log("Received data:", data);
			setErrors(data.errors || []);
		}, 1000);

		return () => clearTimeout(handler);
	}, [textValue]);

	// Removed unused SendButton for a cleaner UI; can be re-added if needed

	// Handlers used by TooltipPortal
	const handleAccept = (d: { start: number; end: number; suggestion: string; error?: string }) => {
		if (typeof d.start === 'number' && typeof d.end === 'number' && d.error) {
			setIgnoredKeys((prev) => { const next = new Set(prev); next.add(`${d.start}-${d.end}-${d.error}`); return next; });
		}
		setTextValue((prev) => prev.slice(0, d.start) + (d.suggestion || "") + prev.slice(d.end));
	};
	const handleDismiss = (d: { start: number; end: number; error: string }) => {
		setIgnoredKeys((prev) => { const next = new Set(prev); next.add(`${d.start}-${d.end}-${d.error}`); return next; });
	};

	const handleExplain = async (d: { start?: number; end?: number; error: string; span?: string }) => {
		// const snippet = d.span || (typeof d.start === 'number' && typeof d.end === 'number' ? textValue.slice(d.start, d.end) : "");
		// const prompt = `Explain the following grammar issue clearly and concisely with the rule and 1-2 short examples.\n\nSelected text: "${snippet}"\nReported issue: ${d.error}`;
		// setChatValue("Loading explanation…");
		// try {
		// 	const res = await fetch('/api/explainations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: prompt }) });
		// 	const text = await res.text();
		// 	setChatValue(text);
		// } catch (err: any) {
		// 	setChatValue(`Error fetching explanation: ${err?.message || String(err)}`);
		// }
	};

	return (
		<>
		{/* Tooltip manager */}
		<TooltipPortal onAccept={handleAccept} onDismiss={handleDismiss} onExplain={handleExplain} />
		<div className="flex justify-center w-full h-full overflow-hidden">
			<div className="flex gap-x-4 w-[90%] p-4">
				<textarea
					className={`
						flex-1 h-full p-8 border-1 dark:bg-default-50 dark:border-llm-sea-glass
						bg-llm-blue-flower/10 border-llm-masala rounded-xl text resize-none
						outline-none text-sm placeholder:opacity-60
					`}
					placeholder="Enter or paste your text..."
					style={{ fontSize: "1rem" }}
					value={textValue}
					onChange={e => setTextValue(e.target.value)}
				/>
				<ChatBox/>
			</div>
		</div>
		</>
	);
}