"use client";

import { Button } from "@heroui/button";
import { JSX, useState, useEffect, useRef, useCallback } from "react";
import { FaMicrophone, FaStop, FaVolumeUp } from "react-icons/fa";
import { LiveSessionManager, ChatMessage } from "@/lib/gemini-live-client";

export default function Speak(): JSX.Element {
	const [conversationLog, setConversationLog] = useState<ChatMessage[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const sessionManagerRef = useRef<LiveSessionManager | null>(null);
	const chatWindowRef = useRef<HTMLDivElement>(null);

	// Callback for LiveSessionManager to update chat messages
	const handleNewMessage = useCallback((message: ChatMessage) => {
		setConversationLog((prev) => [...prev, message]);
	}, []);

	// Callback for LiveSessionManager to update recording status
	const handleRecordingStatusChange = useCallback((recording: boolean) => {
		setIsRecording(recording);
		if (!recording) {
			setApiError(null);
		}
	}, []);

	// Callback for LiveSessionManager to update API errors
	const handleApiError = useCallback((error: string) => {
		setApiError(error);
	}, []);

	// Initialize and clean up LiveSessionManager
	useEffect(() => {
		sessionManagerRef.current = new LiveSessionManager(
			handleNewMessage,
			handleRecordingStatusChange,
			handleApiError
		);

		return () => {
			if (sessionManagerRef.current) {
				sessionManagerRef.current.stopSession();
			}
		};
	}, [handleNewMessage, handleRecordingStatusChange, handleApiError]);

	// Auto-scroll chat window to bottom
	useEffect(() => {
		if (chatWindowRef.current) {
			chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
		}
	}, [conversationLog]);

	const toggleConversation = async () => {
		if (isRecording) {
			await sessionManagerRef.current?.stopSession();
		} else {
			setApiError(null);
			await sessionManagerRef.current?.startSession();
		}
	};

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
		<div className="flex flex-col md:flex-row gap-4 w-[90%] flex-1 pb-4 min-h-0">
			{/* Left side - Conversation display */}
			<div className="flex-1 md:flex-2 flex flex-col min-w-0 min-h-0">
					<div className="flex items-center justify-between mb-2 px-1">
						<label className="text-sm font-semibold text-default-700">Conversation</label>
						<div className="flex items-center gap-1">
							<span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-danger animate-pulse' : 'bg-success'}`}></span>
							<span className="text-xs text-default-500">
								{isRecording ? 'Listening...' : 'Ready'}
							</span>
						</div>
					</div>
					<div className="flex-1 flex flex-col min-h-0">
						<div
							ref={chatWindowRef}
							className={`
								flex-1 p-6 border-4 dark:bg-default-100 dark:border-llm-chinois
								bg-llm-blue-flower/10 border-llm-masala rounded-2xl
								outline-none overflow-y-auto overflow-x-hidden
								hover:border-llm-sea-glass hover:shadow-lg transition-all
							`}
						>
							{conversationLog.length === 0 ? (
								<div className="h-full flex items-center justify-center">
									<p className="text-center text-default-500 italic">
										Click "Start Conversation" to begin speaking with your language tutor!
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{conversationLog.map((msg, index) => (
										<div
											key={index}
											className={`flex items-start gap-3 ${
												msg.type === 'user' ? 'justify-end' : ''
											} ${msg.type === 'status' ? 'justify-center' : ''}`}
										>
											{msg.type !== 'status' && msg.type === 'model' && (
												<div className="w-10 h-10 bg-llm-chinois rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
													AI
												</div>
											)}
											<div
												className={`p-4 rounded-2xl wrap-break-word ${
													msg.type === 'user'
														? 'bg-llm-sea-glass/40 dark:bg-llm-chinois/20 rounded-tr-sm max-w-[70%]'
														: msg.type === 'model'
														? 'bg-default-100 dark:bg-default-50 rounded-tl-sm max-w-[70%]'
														: 'bg-default-200 dark:bg-default-100 text-sm italic max-w-full'
												}`}
											>
												<p className="text-sm text-foreground wrap-break-word whitespace-pre-wrap">{msg.text}</p>
												<p className="text-xs text-default-400 mt-2">
													{new Date(msg.timestamp).toLocaleTimeString()}
												</p>
											</div>
											{msg.type === 'user' && (
												<div className="w-10 h-10 bg-llm-sea-glass rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
													You
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>

						{/* Error display */}
						{apiError && (
							<div className="mt-4 bg-danger-50 dark:bg-danger-100/10 border-2 border-danger rounded-xl p-4">
								<p className="text-sm font-semibold text-danger mb-1">Error</p>
								<p className="text-xs text-danger/80">{apiError}</p>
							</div>
						)}
					</div>
				</div>

			{/* Right side - Controls and info */}
			<div className="flex-none md:flex-1 flex flex-col md:min-w-[320px] md:max-w-[400px]">
				<div className="flex items-center justify-between mb-2 px-1">
					<label className="text-sm font-semibold text-default-700">Voice Controls</label>
					<div className="flex items-center gap-1">
						<span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-danger animate-pulse' : 'bg-success'}`}></span>
						<span className="text-xs text-default-500">{isRecording ? 'Recording' : 'Connected'}</span>
					</div>
				</div>
				<div
					className={`
						border-4 dark:bg-default-100 dark:border-llm-chinois bg-llm-blue-flower/10
						border-llm-masala flex-1 rounded-2xl flex flex-col p-4 md:p-6
						hover:border-llm-sea-glass hover:shadow-lg transition-all
					`}
				>
					{/* Microphone button */}
					<div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-6">
							<div className="text-center">
								<p className="text-sm font-semibold text-foreground mb-2">
									{isRecording ? 'Listening to you...' : 'Start conversation'}
								</p>
								<p className="text-xs text-default-500">
									{isRecording ? 'Click to stop' : 'Click to talk with your tutor'}
								</p>
							</div>

						<button
							onClick={toggleConversation}
							disabled={!!apiError && !isRecording}
							className={`
								w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center
								transition-all shadow-lg hover:shadow-xl
								${isRecording 
									? 'bg-danger scale-110 animate-pulse' 
									: 'bg-llm-chinois hover:scale-105'
								}
								disabled:opacity-50 disabled:cursor-not-allowed
							`}
						>
							{isRecording ? (
								<FaStop className="text-white" size={40} />
							) : (
								<FaMicrophone className="text-white" size={40} />
							)}
						</button>
					</div>					{/* Session stats */}
					<div className="hidden md:block space-y-3 mt-6 pt-6 border-t-2 border-default-200">
						<div className="bg-llm-lace dark:bg-default-50 p-3 rounded-xl">
							<p className="text-xs text-default-500 mb-1">Messages</p>
							<p className="text-lg font-bold text-foreground">
								{conversationLog.filter(m => m.type !== 'status').length}
							</p>
						</div>
						<div className="bg-llm-lace dark:bg-default-50 p-3 rounded-xl">
							<p className="text-xs text-default-500 mb-1">Your Turns</p>
							<p className="text-lg font-bold text-foreground">
								{conversationLog.filter(m => m.type === 'user').length}
							</p>
						</div>
						<div className="bg-llm-lace dark:bg-default-50 p-3 rounded-xl">
							<p className="text-xs text-default-500 mb-1">AI Responses</p>
							<p className="text-lg font-bold text-llm-chinois">
								{conversationLog.filter(m => m.type === 'model').length}
							</p>
						</div>
					</div>

					{/* Compact mobile stats */}
					<div className="flex md:hidden items-center justify-between w-full gap-2 mt-3">
						<div className="flex-1 bg-llm-lace dark:bg-default-50 p-2 rounded-md text-center">
							<p className="text-xs text-default-500">Msgs</p>
							<p className="text-sm font-bold text-foreground">{conversationLog.filter(m => m.type !== 'status').length}</p>
						</div>
						<div className="flex-1 bg-llm-lace dark:bg-default-50 p-2 rounded-md text-center">
							<p className="text-xs text-default-500">You</p>
							<p className="text-sm font-bold text-foreground">{conversationLog.filter(m => m.type === 'user').length}</p>
						</div>
						<div className="flex-1 bg-llm-lace dark:bg-default-50 p-2 rounded-md text-center">
							<p className="text-xs text-default-500">AI</p>
							<p className="text-sm font-bold text-llm-chinois">{conversationLog.filter(m => m.type === 'model').length}</p>
						</div>
					</div>

					{/* Clear conversation button */}
					<Button
							className="mt-4 bg-default-200 dark:bg-default-50 hover:bg-llm-sea-glass transition-all"
							variant="flat"
							fullWidth
							onClick={() => setConversationLog([])}
							disabled={conversationLog.length === 0 || isRecording}
						>
							🗑️ Clear Conversation
						</Button>
					</div>
				</div>
			</div>
			
			{/* Custom scrollbar styles */}
			<style jsx>{`
				/* Smooth scrollbar styling */
				div[ref] {
					scrollbar-width: thin;
					scrollbar-color: rgb(var(--nextui-default-300)) rgb(var(--nextui-default-100));
				}
				
				div[ref]::-webkit-scrollbar {
					width: 8px;
				}
				
				div[ref]::-webkit-scrollbar-track {
					background: rgb(var(--nextui-default-100));
					border-radius: 10px;
				}
				
				div[ref]::-webkit-scrollbar-thumb {
					background: rgb(var(--nextui-default-300));
					border-radius: 10px;
				}
				
				div[ref]::-webkit-scrollbar-thumb:hover {
					background: rgb(var(--nextui-default-400));
				}
			`}</style>
		</div>
	);
}