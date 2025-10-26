import {
	GoogleGenAI,
	LiveServerMessage,
	MediaResolution,
	Modality,
	Session,
} from '@google/genai';

import { responseQueue } from '@/lib/singletons';
import { assert } from "console";

export function getLiveSession(): Promise<Session> {
	const apiKey = process.env.GEMINI_API_KEY;
	assert(apiKey, "GEMINI_API_KEY is not set in environment variables");

	const ai = new GoogleGenAI({ apiKey: apiKey });
	const model = "models/gemini-2.5-flash-native-audio-preview-09-2025";

	const config = {
		responseModalities: [
			Modality.TEXT,
		],
		mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
		speechConfig: {
			voiceConfig: {
				prebuiltVoiceConfig: {
					voiceName: "Zephyr",
				}
			}
		},
		contextWindowCompression: {
			triggerTokens: "25600",
			slidingWindow: { targetTokens: "12800" },
		},
	};

	return ai.live.connect({
		model,
		callbacks: {
			onopen: 	() => console.debug('Opened'),
			onmessage: 	(message: LiveServerMessage) => responseQueue.push(message),
			onerror: 	(e: ErrorEvent) => console.debug('Error:', e.message),
			onclose: 	(e: CloseEvent) => console.debug('Close:', e.reason)
		},
		config
	});
}

// async function main() {
// 	session = await ai.live.connect({
// 		model,
// 		callbacks: {
// 			onopen: function () {
// 				console.debug('Opened');
// 			},
// 			onmessage: function (message: LiveServerMessage) {
// 				responseQueue.push(message);
// 			},
// 			onerror: function (e: ErrorEvent) {
// 				console.debug('Error:', e.message);
// 			},
// 			onclose: function (e: CloseEvent) {
// 				console.debug('Close:', e.reason);
// 			},
// 		},
// 		config
// 	});

// 	session.sendClientContent({
// 		turns: [
// 			`INSERT_INPUT_HERE`
// 		]
// 	});

// 	await handleTurn();

// 	session.close();
// }
