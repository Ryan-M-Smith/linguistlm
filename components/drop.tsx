"use client";

import React, { useRef } from "react";

type DropProps = {
		onDrop: (file: File) => void;
		children: React.ReactNode;
		className?: string;
		style?: React.CSSProperties;
};

export function Drop({ onDrop, children, className, style }: DropProps) {
	const dropZoneRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={dropZoneRef}
			className={className}
			style={style}

			onDragOver={ (e) => {
				e.preventDefault();
				e.stopPropagation();
				dropZoneRef.current?.classList.add("opacity-90", "ring-2", "ring-llm-masala");
			}}

			onDragEnter={ (e) => {
				e.preventDefault();
				e.stopPropagation();
				dropZoneRef.current?.classList.add("opacity-90", "ring-2", "ring-llm-masala");
			}}

			onDragLeave={ (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
					dropZoneRef.current.classList.remove("opacity-90", "ring-2", "ring-llm-masala");
				}
			}}

			onDrop={ (e) => {
				e.preventDefault();
				e.stopPropagation();
				dropZoneRef.current?.classList.remove("opacity-90", "ring-2", "ring-llm-masala");
				const dt = e.dataTransfer;
				if (!dt) return;
				const file = dt.files && dt.files[0];
				if (file) onDrop(file);
			}}
		>
			{children}
		</div>
	);
}
