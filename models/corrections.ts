import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";
const config = {
	thinkingConfig: {
		thinkingBudget: -1,
	},
	responseMimeType: "application/json",
	responseSchema: {
		type: Type.OBJECT,
		required: ["text", "errors", "corrected_text"],
		properties: {
			text: {
				type: Type.STRING,
				description: "The original input text to analyze for grammar mistakes.",
			},
			errors: {
				type: Type.ARRAY,
				description: "List of detected grammatical or stylistic issues in the text.",
				items: {
					type: Type.OBJECT,
					required: ["start", "end", "error", "suggestion", "original"],
					properties: {
						start: {
							type: Type.INTEGER,
							description: "Start index (0-based, inclusive) of the erroneous span within the text.",
						},
						end: {
							type: Type.INTEGER,
							description: "End index (exclusive) of the erroneous span within the text.",
						},
						error: {
							type: Type.STRING,
							description: "Short description of the grammatical issue.",
						},
						suggestion: {
							type: Type.STRING,
							description: "Suggested correction or replacement for the erroneous text.",
						},
						original: {
							type: Type.STRING,
							description: "The exact substring of the original text containing the error.",
						},
					},
				},
			},
			corrected_text: {
				type: Type.STRING,
				description: "The full corrected version of the input text with all fixes applied.",
			},
		},
	},

	systemInstruction: [
		{
			text: `You are a grammar analysis and correction model.
					Analyze the user's text and identify grammatical, spelling, and stylistic mistakes.
					Return structured data listing each issue with its text span and suggested fix.

					Instructions:
					1. Carefully read the input text.
					2. For each issue, return:
					- start and end indices (character positions)
					- error: a short explanation
					- suggestion: the corrected text
					- original: the substring from the input that has the issue
					3. Always include corrected_text: the full corrected version of the text.
					4. If there are no issues, return an empty errors array.
					5. The output must strictly match the schema below.
					`,
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

					// const text = chunk.text;
					// const sanitizedText = text.replace(/\s*\[\d+(?:,\s*\d+)*\]/g, "");
					controller.enqueue(chunk.text);
			}

			controller.close();
		}
	});
}
