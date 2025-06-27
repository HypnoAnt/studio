import { NextRequest, NextResponse } from 'next/server';
import { summarizeSlangUsage, SummarizeSlangUsageInput } from '@/ai/flows/summarize-slang-usage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body || typeof body.text !== 'string' || body.text.trim() === '') {
      return NextResponse.json({ error: 'A non-empty "text" field is required in the request body.' }, { status: 400 });
    }

    const input: SummarizeSlangUsageInput = { text: body.text };

    const result = await summarizeSlangUsage(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request in /api/summarize:", error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
    }

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { 
        error: "Failed to get slang summary.",
        details: errorMessage
      }, 
      { status: 500 }
    );
  }
}
