"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";

interface SelectableTextProps {
	value: string;
	onChange: (value: string) => void;
	onExplain: (selectedText: string) => void;
	className?: string;
	style?: React.CSSProperties;
	placeholder?: string;
	disabled?: boolean;
}

export function SelectableText({
	value,
	onChange,
	onExplain,
	className,
	style,
	placeholder,
	disabled,
}: SelectableTextProps) {
	const ref = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [selectedText, setSelectedText] = useState("");
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, visible: false });
	const isUserTypingRef = useRef(false);

	// Update content only when value changes externally (not from user input)
	useEffect(() => {
		if (ref.current && !isUserTypingRef.current) {
			ref.current.innerText = value;
		}
		isUserTypingRef.current = false;
	}, [value]);

	// Ensure placeholder CSS is present once
	useEffect(() => {
		const id = 'llm-selectable-placeholder-style';
		if (!document.getElementById(id)) {
			const styleEl = document.createElement('style');
			styleEl.id = id;
			styleEl.textContent = `.llm-selectable-placeholder:empty:before {
				content: attr(data-placeholder);
				color: inherit;
				opacity: 0.6;
				pointer-events: none;
				white-space: pre-wrap;
			}`;
			document.head.appendChild(styleEl);
		}
	}, []);

	useEffect(() => {
		const handleSelection = () => {
			if (disabled) return;
			
			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) {
				setTooltipPosition(prev => ({ ...prev, visible: false }));
				return;
			}

			const range = selection.getRangeAt(0);
			const text = selection.toString().trim();

			// Only show tooltip if text is selected and within our component
			if (text && ref.current && ref.current.contains(range.commonAncestorContainer)) {
				setSelectedText(text);
				
				// Get the bounding rect of the selection
				const rect = range.getBoundingClientRect();
				
				// Position tooltip above the selection
				setTooltipPosition({
					x: rect.left + rect.width / 2,
					y: rect.top - 10,
					visible: true,
				});
			} else {
				setTooltipPosition(prev => ({ ...prev, visible: false }));
			}
		};

		// Listen to selection changes
		document.addEventListener('selectionchange', handleSelection);
		document.addEventListener('mouseup', handleSelection);

		return () => {
			document.removeEventListener('selectionchange', handleSelection);
			document.removeEventListener('mouseup', handleSelection);
		};
	}, [disabled]);

	const handleExplainClick = () => {
		if (selectedText) {
			onExplain(selectedText);
			// Clear selection and hide tooltip
			window.getSelection()?.removeAllRanges();
			setTooltipPosition(prev => ({ ...prev, visible: false }));
		}
	};

	return (
		<>
			<div
				ref={ref}
				className={`${className ?? ''} llm-selectable-placeholder`}
				style={{
					...style,
					userSelect: disabled ? 'none' : 'text',
					cursor: disabled ? 'not-allowed' : 'text',
				}}
				contentEditable={!disabled}
				suppressContentEditableWarning
				data-placeholder={placeholder || undefined}
				onInput={(e) => {
					isUserTypingRef.current = true;
					const text = (e.target as HTMLDivElement).innerText;
					onChange(text);
				}}
			/>

			{/* Selection Tooltip */}
			{tooltipPosition.visible && !disabled && (
				<div
					ref={tooltipRef}
					className="fixed z-100000"
					style={{
						left: `${tooltipPosition.x}px`,
						top: `${tooltipPosition.y}px`,
						transform: 'translate(-50%, -100%)',
						pointerEvents: 'auto',
					}}
				>
					<div className="mb-2 bg-llm-sea-glass dark:bg-llm-chinois/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border-2 border-llm-masala dark:border-llm-lace">
						<Button
							size="sm"
							className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
							onPress={handleExplainClick}
						>
							Explain
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
