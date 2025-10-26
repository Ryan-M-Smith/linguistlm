import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";
const config = {
	thinkingConfig: {
		thinkingBudget: -1,
	},

	systemInstruction: [
		{
			text: `You are a grammar analysis and correction model. If the user asks
				   for more information or an explanation about a specific grammar error,
				   provide a detailed but concise explanation of the rule or concept involved,
				   using clear examples and focusing on the specific error in question.`
		}
	],
};

const chat = ai.chats.create({ model, config });

export async function generate(query: string) {
	return new ReadableStream({
		start: async (controller) => {
			const response = await chat.sendMessageStream({
				message: query
			});

			for await (const chunk of response) {
					if (!chunk.text) {
						continue;
					}

					controller.enqueue(chunk.text);
			}

			controller.close();
		}
	});
}