"use client";

import { Button } from "@heroui/button";
import { JSX, useState } from "react";
import { FaMicrophone, FaStop, FaVolumeUp } from "react-icons/fa";

export default function Speak(): JSX.Element {
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);

	return (
		<div className="flex flex-col justify-center items-center w-full h-full overflow-hidden bg-llm-lace dark:bg-default-50 relative">
			{/* Header section */}
			<div className="w-[90%] pt-4 pb-2">
				<div className="text-center mb-2">
					<h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
						Practice Your <span className="text-llm-chinois">Speaking Skills</span>
					</h1>
				</div>
			</div>

			{/* Main content area */}
			<div className="flex gap-x-4 w-[90%] flex-1 pb-4">
				{/* Left side - Conversation display */}
				<div className="flex-1 flex flex-col">
					<div className="flex items-center justify-between mb-2 px-1">
						<label className="text-sm font-semibold text-default-700">Conversation</label>
						<div className="flex items-center gap-1">
							<span className={`w-2 h-2 rounded-full ${isListening ? 'bg-danger animate-pulse' : 'bg-success'}`}></span>
							<span className="text-xs text-default-500">
								{isListening ? 'Listening...' : 'Ready'}
							</span>
						</div>
					</div>
					<div
						className={`
							flex-1 p-6 border-4 dark:bg-default-100 dark:border-llm-chinois
							bg-llm-blue-flower/10 border-llm-masala rounded-2xl
							outline-none overflow-y-auto
							hover:border-llm-sea-glass hover:shadow-lg transition-all
						`}
					>
						<div className="space-y-4 h-full flex flex-col justify-end">
							{/* Sample conversation messages */}
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="w-10 h-10 bg-llm-chinois rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
										AI
									</div>
									<div className="bg-default-100 dark:bg-default-50 p-4 rounded-2xl rounded-tl-sm max-w-[80%]">
										<p className="text-sm text-foreground">
											Bonjour! Comment allez-vous aujourd'hui? Let's practice some basic French greetings.
										</p>
										<p className="text-xs text-default-500 mt-2">
											Hello! How are you today?
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 justify-end">
									<div className="bg-llm-sea-glass/40 dark:bg-llm-chinois/20 p-4 rounded-2xl rounded-tr-sm max-w-[80%]">
										<p className="text-sm text-foreground">
											Je vais bien, merci!
										</p>
										<p className="text-xs text-default-500 mt-2">
											I'm doing well, thank you!
										</p>
									</div>
									<div className="w-10 h-10 bg-llm-sea-glass rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
										You
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-10 h-10 bg-llm-chinois rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
										AI
									</div>
									<div className="bg-default-100 dark:bg-default-50 p-4 rounded-2xl rounded-tl-sm max-w-[80%]">
										<p className="text-sm text-foreground">
											Excellent pronunciation! Now, can you tell me what you did today?
										</p>
									</div>
								</div>

								{isSpeaking && (
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 bg-llm-chinois rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 animate-pulse">
											<FaVolumeUp size={16} />
										</div>
										<div className="bg-default-100 dark:bg-default-50 p-4 rounded-2xl rounded-tl-sm max-w-[80%]">
											<div className="flex gap-2">
												<div className="w-2 h-2 bg-llm-chinois rounded-full animate-bounce"></div>
												<div className="w-2 h-2 bg-llm-chinois/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
												<div className="w-2 h-2 bg-llm-chinois/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Right side - Controls and info */}
				<div className="w-[30%] flex flex-col">
					<div className="flex items-center justify-between mb-2 px-1">
						<label className="text-sm font-semibold text-default-700">Voice Controls</label>
						<div className="flex items-center gap-1">
							<span className="w-2 h-2 bg-success rounded-full"></span>
							<span className="text-xs text-default-500">Connected</span>
						</div>
					</div>
					<div
						className={`
							border-4 dark:bg-default-100 dark:border-llm-chinois bg-llm-blue-flower/10
							border-llm-masala flex-1 rounded-2xl flex flex-col p-6
							hover:border-llm-sea-glass hover:shadow-lg transition-all
						`}
					>
						{/* Microphone button */}
						<div className="flex-1 flex flex-col items-center justify-center gap-6">
							<div className="text-center">
								<p className="text-sm font-semibold text-foreground mb-2">
									{isListening ? 'Listening to you...' : 'Tap to start speaking'}
								</p>
								<p className="text-xs text-default-500">
									{isListening ? 'Release when finished' : 'Hold to talk with your tutor'}
								</p>
							</div>

							<button
								onMouseDown={() => setIsListening(true)}
								onMouseUp={() => setIsListening(false)}
								onTouchStart={() => setIsListening(true)}
								onTouchEnd={() => setIsListening(false)}
								className={`
									w-32 h-32 rounded-full flex items-center justify-center
									transition-all shadow-lg hover:shadow-xl
									${isListening 
										? 'bg-danger scale-110 animate-pulse' 
										: 'bg-llm-chinois hover:scale-105'
									}
								`}
							>
								{isListening ? (
									<FaStop className="text-white" size={40} />
								) : (
									<FaMicrophone className="text-white" size={40} />
								)}
							</button>

							{isListening && (
								<div className="flex gap-1">
									<div className="w-1 h-8 bg-danger rounded-full animate-pulse"></div>
									<div className="w-1 h-12 bg-danger/80 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
									<div className="w-1 h-16 bg-danger/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
									<div className="w-1 h-12 bg-danger/80 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
									<div className="w-1 h-8 bg-danger rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
								</div>
							)}
						</div>

						{/* Quick stats */}
						<div className="space-y-3 mt-6 pt-6 border-t-2 border-default-200">
							<div className="bg-llm-lace dark:bg-default-50 p-3 rounded-xl">
								<p className="text-xs text-default-500 mb-1">Today's Practice</p>
								<p className="text-lg font-bold text-foreground">12 minutes</p>
							</div>
							<div className="bg-llm-lace dark:bg-default-50 p-3 rounded-xl">
								<p className="text-xs text-default-500 mb-1">Words Spoken</p>
								<p className="text-lg font-bold text-foreground">156 words</p>
							</div>
							<div className="bg-llm-lace dark:bg-default-50 p-3 rounded-xl">
								<p className="text-xs text-default-500 mb-1">Accuracy Score</p>
								<p className="text-lg font-bold text-llm-chinois">87%</p>
							</div>
						</div>

						{/* Settings button */}
						<Button
							className="mt-4 bg-default-200 dark:bg-default-50 hover:bg-llm-sea-glass transition-all"
							variant="flat"
							fullWidth
						>
							⚙️ Settings
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}