import { NextRequest } from "next/server";
import { generate } from "@/models/explainations";

export async function POST(req: NextRequest) {
	try {
		const { query } = await req.json();

		if (!query || typeof query !== "string") {
			return new Response(
				JSON.stringify({ error: "Missing or invalid query" }),
				{ status: 400 }
			);
		}

		const stream = await generate(query);
		return new Response(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache",
			},
		});
	}
	catch (err: any) {
		return new Response(
			JSON.stringify({ error: err.message || "Unknown error" }),
			{ status: 500 }
		);
	}
}
