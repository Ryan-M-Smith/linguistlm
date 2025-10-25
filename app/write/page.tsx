import { Button } from "@heroui/button";
import { FaCircleArrowUp } from "react-icons/fa6";
import { JSX } from "react";
import { Textarea } from "@heroui/input";

export default function Write(): JSX.Element {
	const SendButton = () => (
		<Button
			className="absolute bottom-0 right-0"
			variant="ghost"
			radius="full"
			startContent={<FaCircleArrowUp size={30}/>}
			isIconOnly
		/>
	);
	
	return (
		<div className="flex justify-center w-full h-full overflow-hidden">
			<div className="flex gap-x-4 w-[90%] p-4">
				<textarea
					className={`
						flex-1 h-full p-4 border-1 dark:bg-default-50 dark:border-llm-sea-glass
						bg-llm-blue-flower/10 border-llm-masala resize-none rounded-xl
						outline-none text
					`}
					placeholder="Enter or paste your text..."
					style={{ fontSize: "1rem" }}
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
						endContent={
							<Button
								className="transition-none hover:bg-transparent hover:opacity-100"
								variant="ghost"
								radius="full"
								startContent={<FaCircleArrowUp size={30} />}
								isIconOnly
							/>
						}
						maxRows={4}
					/>
				</div>
			</div>
		</div>
	);
}