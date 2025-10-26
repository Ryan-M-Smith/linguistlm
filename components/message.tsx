//
// Filename: chat-bubble.tsx
// Description: A chat bubble
// Copyright (c) 2025 Ryan Smith <rysmith2113@gmail.com>
//

import { JSX, ReactNode } from "react";
import { Spinner } from "@heroui/spinner";

interface MessageProps {
	className?: string;
	children?: 	ReactNode;
	role?: 		"user" | "model";
	isLoading?: boolean;
	isFirst?: 	boolean;
}

export default function Message({ className, children, role, isLoading, isFirst = false }: MessageProps): JSX.Element {
	const User = ({ children }: { children: ReactNode }) => {
		return (
			<div className={`${className} flex flex-col w-full justify-end px-2 sm:px-4 mt-4 mb-1`} data-role="user">
				{/* User message */}
				<div className="flex justify-end w-full">
					<div className={`flex flex-col items-end relative max-w-[85%] sm:max-w-[75%]`}>
						{/* Bubble */}
						<div className="rounded-2xl rounded-tr-none dark:bg-default-100 bg-blue-100 px-3 sm:px-5 py-2 w-full wrap-break-word whitespace-normal overflow-hidden">
							{children}
						</div>
					</div>
				</div>
			</div>
		)
	}

	const Model = ({ children }: { children: ReactNode }) => {
		return (
			<div className="flex w-full justify-center px-2 sm:px-4 my-4" data-role="model">
				<div className="text-left text-base sm:text-lg text-zinc-100 whitespace-pre-line">
					{isLoading ? (
						<div className="flex items-center gap-2">
							<span> Waiting on LinguistLM </span>
							<Spinner
								className="flex items-center"
								variant="dots"
								color="default"
							/>
						</div>
					) : children}
				</div>
			</div>
		);
	}

	return role === "user"? (
		<User> {children} </User>
	) : (
		<Model> {children} </Model>
	);
}