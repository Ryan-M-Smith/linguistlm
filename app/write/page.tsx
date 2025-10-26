"use client";

import { JSX, useEffect, useRef, useState } from "react";

import ChatBox, { ChatBoxHandle } from "@/components/chatbox";
import type { GrammarError } from "@/lib/highlight";
import { Highlighter } from "@/components/highlighter";
import { TooltipPortal } from "@/components/tooltip-portal";

export default function Write(): JSX.Element {
	const [textValue, setTextValue] = useState("");
	const [errors, setErrors] = useState<GrammarError[]>([]);
	const [ignoredKeys, setIgnoredKeys] = useState<Set<string>>(new Set());
    const chatRef = useRef<ChatBoxHandle | null>(null);

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
							absolute inset-0 w-full h-full p-8 border-1 dark:bg-default-50 dark:border-llm-sea-glass
							bg-llm-blue-flower/10 border-llm-masala rounded-xl text resize-none outline-none text-sm
							placeholder:opacity-60 font-sans whitespace-pre-wrap wrap-break-word focus:outline-none
						`}
						style={{
							fontSize: "1rem",
							color: typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
								? "#f3f3e7"
								: "#302c2a",
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