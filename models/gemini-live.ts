
/**
 * Streams Gemini Live API responses for audio-to-audio chat.
 * @param history Conversation history (array of {role, parts})
 * @param audioBuffer User's audio input as a Buffer (webm or pcm)
 * @returns ReadableStream that yields Gemini's live audio responses as base64
 */
export async function streamLiveAudio(
	history: { role: string; parts: { text: string }[] }[],
	audioBuffer: Buffer
): Promise<ReadableStream> {
	const session = await getLiveSession();

	// Send conversation history as context (if any)
	if (history && history.length > 0) {
		session.sendClientContent({ turns: history });
	}

	// Send the user's audio as a real-time input (as Blob)
	// Gemini expects a Blob-like object with base64 data and mimeType
	const audioUint8 = new Uint8Array(audioBuffer);
	const base64 = Buffer.from(audioUint8).toString('base64');
	const audioBlob = {
		data: base64,
		mimeType: 'audio/pcm;rate=16000', // or webm if supported by Gemini
	};
	session.sendRealtimeInput({ media: audioBlob });

	// Stream Gemini's live audio responses as they arrive
	const stream = new ReadableStream({
		async start(controller) {
			let done = false;
			while (!done) {
				const msg: LiveServerMessage | undefined = await new Promise(resolve => {
					const check = () => {
						// @ts-ignore
						import("@/lib/singletons").then(({ responseQueue }) => {
							if (responseQueue.length > 0) {
								resolve(responseQueue.shift());
							} else {
								setTimeout(check, 50);
							}
						});
					};
					check();
				});
				// Only stream audio parts
				if (msg && msg.serverContent && msg.serverContent.modelTurn) {
					const audioParts = msg.serverContent.modelTurn.parts?.filter((p: any) => p.inlineData && p.inlineData.mimeType?.startsWith("audio"));
					if (audioParts && audioParts.length > 0) {
						for (const part of audioParts) {
							if (part.inlineData?.data) {
								controller.enqueue(`__AUDIO__${part.inlineData.data}`);
							}
						}
					}
					if (msg.serverContent.turnComplete) {
						done = true;
					}
				}
			}
			controller.close();
			session.close();
		}
	});
	return stream;
}

import { getLiveSession } from "@/lib/gemini-model";
import { LiveServerMessage } from "@google/genai";

/**
 * Streams Gemini Live API responses for a back-and-forth live chat.
 * @param history Conversation history (array of {role, parts})
 * @param message User's new message
 * @returns ReadableStream that yields Gemini's live responses as text
 */
export async function streamLive(
	history: { role: string; parts: { text: string }[] }[],
	message: string
): Promise<ReadableStream> {
	// Start a new live session
	const session = await getLiveSession();

	// Send the full conversation (history + new user message)
	const turns = [
		...history.map(h => h.parts.map(p => p.text).join("\n")),
		message
	];
	session.sendClientContent({ turns });

	// Stream Gemini's live responses as they arrive
		const stream = new ReadableStream({
			async start(controller) {
				let done = false;
				while (!done) {
					// Wait for a message to appear in the queue
					const msg: LiveServerMessage | undefined = await new Promise(resolve => {
						const check = () => {
							// @ts-ignore
							import("@/lib/singletons").then(({ responseQueue }) => {
								if (responseQueue.length > 0) {
									resolve(responseQueue.shift());
								} else {
									setTimeout(check, 50);
								}
							});
						};
						check();
					});
					// Stream text as it arrives
					if (msg && msg.serverContent && msg.serverContent.modelTurn) {
						const text = msg.text;
						if (text) controller.enqueue(text);
						// End of turn if turnComplete is true
						if (msg.serverContent.turnComplete) {
							done = true;
						}
					}
				}
				controller.close();
				session.close();
			}
		});
		return stream;
}

