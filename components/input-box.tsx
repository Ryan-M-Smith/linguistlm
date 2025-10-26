"use client";

import { Button } from "@heroui/button";
import { FaArrowUp } from "react-icons/fa";
import { JSX, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { Textarea } from "@heroui/input";

interface InputBoxProps {
	className?: string;
	onSubmit: 	(value: string) => void;
}

export default function InputBox({ className, onSubmit }: InputBoxProps): JSX.Element {
	const [query, setQuery] = useState<string>("");
	const [canSend, setCanSend] = useState<boolean>(false);
	
	const sendQuery = () => {
		onSubmit(query);
		setQuery("");
		setCanSend(false); // Disable the send button after clearing input

		// Unfocus the textarea on mobile to hide the keyboard
		if (window.innerWidth < 640 && document.activeElement) {
			(document.activeElement as HTMLElement).blur();
		}
	}

	const SendButton = () => (
		<Button
			className={`
				absolute right-3 bottom-3 bg-llm-masala text-white
				rounded-full shadow-sm hover:bg-llm-sea-glass
				focus:outline-none focus:ring-2 focus:ring-llm-sea-glass z-10
				border-2 dark:border-llm-sea-glass border-llm-masala
			`}
			radius="full"
			variant="bordered"
			startContent={<FaArrowUp size={16} />}
			isDisabled={!canSend}
			isIconOnly
			onPress={sendQuery}
		/>
	);

	// Keep canSend state in sync with query (trim to avoid whitespace-only)
	useEffect(() => {
		setCanSend(query.trim().length > 0);
	}, [query]);

	return (
		<Textarea
			className="p-4 overflow-y-auto resize-none"
			classNames={{
				inputWrapper: `border-1 dark:bg-default-50 dark:border-llm-sea-glass
								dark:bg-llm-masala bg-llm-lace hover:bg-llm-lace
								hover:dark:bg-llm-masala transition-none`
			}}
			value={query}
			placeholder="Ask for help with your writing..."
			radius="lg"
			maxRows={4}
			endContent={<SendButton/>}

			onValueChange={(value: string) => {
				setQuery(value);
				setCanSend(value.trim().length > 0);
			}}

			onKeyDown={(event) => {
				if (event.key === "Enter" && !event.shiftKey && canSend) {
					event.preventDefault();
					sendQuery();
				}
			}}
		/>
	)
}