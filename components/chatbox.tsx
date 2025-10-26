import { Button } from "@heroui/button";
import { FaArrowUp } from "react-icons/fa6";
import { JSX, useState } from "react";
import { Textarea } from "@heroui/input";

interface ChatBoxProps {
	className?: string;
}

export default function ChatBox({ className }: ChatBoxProps): JSX.Element {
	const [chatValue, setChatValue] = useState("");
	
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
			isIconOnly
		/>
	);

	return (
		<div
			className={`
				border-1 dark:bg-default-50 dark:border-llm-sea-glass bg-llm-blue-flower/10
				border-llm-masala w-[30%] rounded-xl flex flex-col justify-end
				hover:bg-llm-blue-flower/10 hover:dark:bg-default-50
				hover:border-llm-masala transition-none
			`}
		>	
			<div>

			</div>

			<Textarea
				className="p-4 overflow-y-auto resize-none"
				classNames={{
					inputWrapper: `border-1 dark:bg-default-50 dark:border-llm-sea-glass
								   dark:bg-llm-masala bg-llm-lace hover:bg-llm-lace
								   hover:dark:bg-llm-masala transition-none`
				}}
				value={chatValue}
				onChange={ (e) => setChatValue(e.target.value) }
				placeholder="Explanations will appear here..."
				radius="lg"
				maxRows={4}
				endContent={<SendButton/>}
			/>
		</div>
	)
}