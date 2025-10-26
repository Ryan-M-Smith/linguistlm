"use client";

import { JSX, forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { ForwardedRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import InputBox from "./input-box";
import Message from "@/components/message";

type Role = "user" | "model";
type ChatMessage = { id: string; role: Role; text: string; isLoading?: boolean };

export type ChatBoxHandle = {
	send: (prompt: string) => Promise<void>;
};

interface ChatBoxProps {
	className?: string;
	endpoint?: string;
}

function ChatBoxImpl({ className, endpoint = "/api/explainations" }: ChatBoxProps, ref: ForwardedRef<ChatBoxHandle>): JSX.Element {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	// useId yields a value that's consistent between server and client, avoiding hydration mismatches
	const listId = useId();
	const listRef = useRef<HTMLDivElement | null>(null);

	// When a new message is added, keep the view anchored to the top of the chat list
	// Scroll to top of last user message when a new prompt is added
	useEffect(() => {
		if (!messages.length || !listRef.current) return;
		const el = listRef.current;
		const userMessages = el.querySelectorAll("[data-role='user']");
		const lastUserEl = userMessages[userMessages.length - 1];

		if (lastUserEl && messages[messages.length - 1].isLoading) {
			const containerRect = el.getBoundingClientRect();
			const messageRect = lastUserEl.getBoundingClientRect();
			console.log(messageRect.top, containerRect.top, el.scrollTop);
			const offset = messageRect.top - containerRect.top + el.scrollTop - 40; // 40px padding from top
			el.scrollTo({ top: offset, behavior: "smooth" });
		}
	}, [messages]);

	const send = async (prompt: string) => {
		const q = prompt?.trim();
		if (!q) return;

		const idUser = crypto.randomUUID?.() || `${Date.now()}-u`;
		const idModel = crypto.randomUUID?.() || `${Date.now()}-m`;

		setMessages((prev) => [
			...prev,
			{ id: idUser, role: "user", text: q },
			{ id: idModel, role: "model", text: "", isLoading: true },
		]);

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: q }),
			});
			const reader = res.body?.getReader();
			if (!reader) {
				const text = await res.text();
				setMessages((prev) => prev.map(m => m.id === idModel ? { ...m, text, isLoading: false } : m));
			} else {
				const decoder = new TextDecoder("utf-8");
				let first = true;
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					setMessages((prev) => prev.map(m => {
						if (m.id !== idModel) return m;
						const nextText = (m.text || "") + chunk;
						return { ...m, text: nextText, isLoading: first ? false : m.isLoading };
					}));
					first = false;
				}
				setMessages((prev) => prev.map(m => m.id === idModel ? { ...m, isLoading: false } : m));
			}
		}
		catch (err: any) {
			const msg = err?.message || String(err);
			setMessages((prev) => prev.map(m => m.id === idModel ? { ...m, text: `Error: ${msg}`, isLoading: false } : m));
		}

		// No auto-bottom scroll; we keep the chat anchored to the top when messages change
	};

	// Expose the send method to parents (e.g., write page Explain action)
	useImperativeHandle(ref, () => ({ send }), [send]);

	return (
		<div
			className={`
				${className} border-4 dark:bg-default-100 border-llm-chinois 
				bg-llm-blue-flower/40 w-[30%] rounded-xl flex
				flex-col h-full min-h-0 max-h-full hover:bg-llm-blue-flower/40 hover:dark:bg-default-100
				transition-none overflow-none
			`}
		>	
			<div ref={listRef} id={`chat-list-${listId}`} className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 pt-2">
				{messages.map((m, i) => (
					<Message key={m.id} role={m.role} isLoading={m.isLoading} isFirst={i === 0}>
						{m.role === "model" ? (
							<div
								className="
									text-medium leading-5 prose dark:text-llm-lace text-llm-masala
									prose-headings:mt-2 prose-headings:mb-1 prose-headings:leading-tight
									prose-h1:text-md prose-h2:text-sm prose-h3:text-sm
									prose-p:my-0.5 prose-p:leading-snug
									prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-ul:pl-5 prose-ol:pl-5
									prose-strong:font-semibold
									prose-code:text-[0.9em]
									prose-pre:my-2 prose-blockquote:my-2
									dark:prose-a:text-blue-400 prose-a:text-primary
								"
							>
								<Markdown remarkPlugins={[remarkGfm]}>{m.text}</Markdown>
							</div>
						) : (
							m.text
						)}
					</Message>
				))}
			</div>

			<div className="p-2">
				<InputBox onSubmit={send} />
			</div>
		</div>
	)
}

export default forwardRef(ChatBoxImpl);