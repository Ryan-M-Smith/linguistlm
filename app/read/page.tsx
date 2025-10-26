"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { FaArrowUp } from "react-icons/fa6";
import { HiOutlineUpload } from "react-icons/hi";
import { JSX, useRef, useState } from "react";

import ChatBox, { ChatBoxHandle } from "@/components/chatbox";
import { Drop } from "@/components/drop";
import { SelectableText } from "@/components/selectable-text";

export default function Read(): JSX.Element {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileNameRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<ChatBoxHandle | null>(null);
    const [textValue, setTextValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [detectedLanguage, setDetectedLanguage] = useState<string>("");

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
            const language = data.language || "Unknown";

            setTextValue(extractedText);
            setDetectedLanguage(language);
            if (fileNameRef.current) fileNameRef.current.textContent = file.name;
        } catch (error) {
            console.error("Error reading file:", error);
            if (fileNameRef.current) {
                fileNameRef.current.textContent = "Error reading file";
            }
            setDetectedLanguage("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExplain = async (selectedText: string) => {
        const langContext = detectedLanguage && detectedLanguage !== "Unknown" 
            ? ` (in ${detectedLanguage})` 
            : "";
        const prompt = `Explain the following text${langContext}. Provide context, meaning, and any relevant cultural or linguistic information:\n\n"${selectedText}"`;
        await chatRef.current?.send(prompt);
    };

    const handleTextChange = (newText: string) => {
        setTextValue(newText);
        if (newText === "" && fileNameRef.current) {
            fileNameRef.current.textContent = "";
            setDetectedLanguage("");
        }
    };


    return (
        <div className="flex flex-col justify-center items-center w-full h-full overflow-hidden bg-llm-lace dark:bg-default-50 relative">
            {/* Header section */}
            <div className="w-[90%] pt-4 pb-2">
                <div className="text-center mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                        Practice Your <span className="text-llm-chinois">Reading Skills</span>
                    </h1>
                    <p className="text-default-600 text-xs md:text-sm">
                        Upload text or paste content to practice comprehension with AI assistance
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-[90%] p-4 flex-1 min-h-0">
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
                            h-full p-4 border-4 border-llm-chinois
                            bg-llm-blue-flower/40 dark:bg-default-100 resize-none rounded-xl
                            outline-none text relative
                        `}
                    >
                        <SelectableText
                            value={textValue}
                            onChange={handleTextChange}
                            onExplain={handleExplain}
                            disabled={isLoading}
                            placeholder="Paste your text or drop a file here..."
                            className={`
                                w-full h-full p-4 bg-transparent outline-none
                                text-sm overflow-auto whitespace-pre-wrap
                            `}
                            style={{
                                fontSize: "1rem",
                                fontFamily: "inherit",
                                lineHeight: 1.5,
                                direction: "ltr",
                                unicodeBidi: "plaintext",
                            }}
                        />

                        {isLoading ? (
                            <div className="absolute right-4 bottom-4 z-10">
                                <Spinner size="lg" color="primary" />
                            </div>
                        ) : (
                            <Button
                                className={`
                                    absolute justify-start right-4 bottom-4 bg-default-50 text-llm-masala dark:text-white
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

                        <div className="absolute left-6 bottom-4 flex items-center gap-3 text-xs opacity-75 select-none pointer-events-none">
                            <div ref={fileNameRef} id="dropped-file-name" />
                            {detectedLanguage && detectedLanguage !== "Unknown" && (
                                <div className="flex items-center gap-1">
                                    <span>•</span>
                                    <span className="font-semibold text-llm-sea-glass dark:text-llm-chinois">
                                        {detectedLanguage}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </Drop>
                <ChatBox ref={chatRef} className="w-full md:w-[30%]" endpoint="/api/reader"/>
            </div>
        </div>
    );
}