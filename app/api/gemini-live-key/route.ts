import { NextResponse } from 'next/server';

/**
 * API route to provide the Gemini API key to the client
 * Only use this for client-side direct API access
 */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({ apiKey });
}
