"use client";

import { Button } from "@heroui/button";
import { FaArrowUp } from "react-icons/fa6";
import { JSX, useState } from "react";
import { Textarea } from "@heroui/input";

export default function Write(): JSX.Element {
	const [textValue, setTextValue] = useState("");

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
				<div
					className={`
						border-1 dark:bg-default-50 dark:border-llm-sea-glass bg-llm-blue-flower/10
						border-llm-masala w-[30%] rounded-xl flex flex-col justify-end
						hover:bg-llm-blue-flower/10 hover:dark:bg-default-50
						hover:border-llm-masala transition-none
					`}
				>
					<Textarea
						className="p-4 overflow-y-auto resize-none"
						classNames={{
							inputWrapper: `border-1 dark:bg-default-50 dark:border-llm-sea-glass
										   dark:bg-llm-masala bg-llm-lace hover:bg-llm-lace
										   hover:dark:bg-llm-masala transition-none`
						}}
						radius="lg"
						endContent={<SendButton />}
						maxRows={4}
					/>
				</div>
			</div>
		</div>
	);
}