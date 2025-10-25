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
		<div className="flex justify-center h-full w-full overflow-hidden">
			<div className="flex gap-x-4 w-[90%] p-4">
				<textarea
					className="flex-1 h-full p-4 bg-default-50 text-foreground resize-none rounded-xl"
					placeholder="Enter or paste your text..."
					style={{ fontSize: "1rem" }}
				/>

				<div className="bg-default-50 w-[30%] rounded-xl flex flex-col justify-end">
					<Textarea
						className="p-4 overflow-y-auto resize-none"
						radius="lg"
						endContent={<SendButton/>}
						maxRows={4}
					/>
				</div>
			</div>
		</div>
	);
}