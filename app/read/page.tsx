"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { FaArrowUp } from "react-icons/fa6";
import { HiOutlineUpload } from "react-icons/hi";
import { JSX, useRef, useState } from "react";

import ChatBox from "@/components/chatbox";
import { Drop } from "@/components/drop";

export default function Read(): JSX.Element {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileNameRef = useRef<HTMLDivElement>(null);
    const [textValue, setTextValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    const handleDrop = async (file: File) => {
        try {
            setIsLoading(true);
            if (fileNameRef.current) fileNameRef.current.textContent = `Loading ${file.name}...`;

            // Create form data and send to API
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/read-file', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const extractedText = data.text || "";

            setTextValue(extractedText);
            if (fileNameRef.current) fileNameRef.current.textContent = file.name;
        } catch (error) {
            console.error("Error reading file:", error);
            if (fileNameRef.current) {
                fileNameRef.current.textContent = "Error reading file";
            }
        } finally {
            setIsLoading(false);
        }
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
                            // Reset input so the same file can be selected again
                            e.target.value = '';
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
                            disabled={isLoading}
                        />

                        {isLoading ? (
                            <div className="absolute right-4 bottom-4 z-10">
                                <Spinner size="lg" color="primary" />
                            </div>
                        ) : (
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
                        )}

                        <div
                            ref={fileNameRef}
                            id="dropped-file-name"
                            className="absolute left-6 bottom-4 text-xs opacity-75 select-none pointer-events-none"
                        />
                    </div>
                </Drop>
                <ChatBox endpoint="/api/explainations"/>
            </div>
        </div>
    );
}