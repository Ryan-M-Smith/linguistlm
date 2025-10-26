import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";
const config = {
	thinkingConfig: {
		thinkingBudget: -1,
	},

	systemInstruction: [
		{
			text: `You are a translation assistant and semantic understanding model. If the user provides
				   text in one language, convert it to the target language specified by the user, ensuring
				   that the meaning and context are preserved accurately. You should define any words that
				   may be necessary to clarify and explain the phrase in the target language.`
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