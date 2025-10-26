"use client";

import { Button } from "@heroui/button";
import { FaArrowUp } from "react-icons/fa6";
import { HiOutlineUpload } from "react-icons/hi";
import { JSX, useRef, useState } from "react";
import { Textarea } from "@heroui/input";

import { Drop } from "@/components/drop";

export default function Read(): JSX.Element {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileNameRef = useRef<HTMLDivElement>(null);
    const [textValue, setTextValue] = useState("");

	const SendButton = () => (
		<Button
			className={`
				absolute right-3 bottom-3 bg-llm-default-50 text-white
				rounded-full shadow-sm hover:bg-llm-sea-glass
				focus:outline-none focus:ring-2 focus:ring-llm-sea-glass z-10
				border-2 dark:border-llm-chinois border-llm-masala
			`}
			radius="full"
			variant="bordered"
			startContent={<FaArrowUp size={16} />}
			isIconOnly
		/>
	);

    const handleDrop = (file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (textareaRef.current) {
                textareaRef.current.value = String(reader.result ?? "");
                textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }));
            }
            if (fileNameRef.current) fileNameRef.current.textContent = file.name;
        };

        reader.onerror = () => {
            console.error("File read error", reader.error);
        };
		
        reader.readAsText(file);
    };


    return (
        <div className="flex justify-center w-full h-full overflow-hidden">
            <div className="flex gap-x-4 w-[90%] p-4">
                <Drop
                    onDrop={ (file: File) => {
                        handleDrop(file);
                    }}
                    className="flex-1 min-w-0 h-full relative"
                >
                    <input
                        id="file-picker"
                        type="file"
                        accept="*/*"
                        className="hidden"
                        onChange={ (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];

                            if (!file) {
								return;
							}

                            handleDrop(file);
                        }}
                    />
                    <div
                        className={`
                            h-full p-4 border-4 dark:border-llm-chinois
                            bg-default-100 border-llm-masala resize-none rounded-xl
                            outline-none text relative
                        `}
                    >
                        <textarea
                            ref={textareaRef}
                            id="main-textarea"
                            className={`
                                w-full h-full p-4 bg-transparent resize-none outline-none
                                text-sm placeholder:opacity-60
                            `}
                            placeholder="Paste your text, drop a file here, or click to upload..."
                            style={{ fontSize: "1rem" }}
                            value={textValue}
                            onChange={e => {
                                setTextValue(e.target.value);
                                if (e.target.value === "" && fileNameRef.current) {
                                    fileNameRef.current.textContent = "";
                                }
                            }}
                        />

                        <Button
							className={`
								absolute justify-start right-4 bottom-4 bg-default-50 text-white
								rounded-full p-2 shadow-lg hover:bg-llm-sea-glass focus:outline-none
								focus:ring-2 focus:ring-llm-sea-glass z-10 border-2 dark:border-llm-chinois border-llm-masala
							`}
							startContent={<HiOutlineUpload size={24}/>}
							onPress={() => {
								const el = document.getElementById("file-picker") as HTMLInputElement | null;
								el?.click();
							}}
							isIconOnly
						/>

                        <div
                            ref={fileNameRef}
                            id="dropped-file-name"
                            className="absolute left-6 bottom-4 text-xs opacity-75 select-none pointer-events-none"
                        />
                    </div>
                </Drop>
                <div
                    className={`
                        border-4 dark:bg-default-100 dark:border-llm-chinois bg-llm-blue-flower/10
                        border-llm-masala w-[30%] rounded-xl flex flex-col justify-end
                        hover:bg-llm-blue-flower/10 hover:dark:bg-default-100
                        hover:border-llm-masala transition-none
                    `}
                >
                    <Textarea
                        className="p-4 overflow-y-auto resize-none"
                        classNames={{
                            inputWrapper: `border-4 dark:bg-llm-sea-glass/60 dark:border-llm-chinois
                                           dark:bg-llm-chinois/20 bg-llm-lace hover:bg-llm-lace
                                           hover:dark:bg-llm-chinois/20 transition-none`
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