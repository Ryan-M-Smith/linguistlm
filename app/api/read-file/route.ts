import { NextRequest } from "next/server";
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return new Response(
				JSON.stringify({ error: "No file provided" }),
				{ status: 400 }
			);
		}

		// Convert file to base64
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64 = buffer.toString('base64');

		// Determine MIME type
		const mimeType = file.type || 'application/octet-stream';

		// Create a chat session with Gemini
		const chat = ai.chats.create({ 
			model,
			config: {
				systemInstruction: [
					{
						text: `You are a document text extraction assistant. Extract all text content from the provided file and return it as plain text. Do not add any commentary, explanations, or formatting - just return the raw text content from the document.`
					}
				]
			}
		});

		// Send the file to Gemini
		const response = await chat.sendMessage({
			message: [
				{
					text: "Please extract all text content from this file:"
				},
				{
					inlineData: {
						mimeType: mimeType,
						data: base64
					}
				}
			]
		});

		const extractedText = response.text || "";

		return new Response(
			JSON.stringify({ text: extractedText }),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
	catch (err: any) {
		console.error("Error reading file:", err);
		return new Response(
			JSON.stringify({ error: err.message || "Unknown error" }),
			{ status: 500 }
		);
	}
}
