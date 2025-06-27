"use server";

import { identifySlang, type IdentifySlangInput } from "@/ai/flows/identify-slang";

export async function analyzeSlang(input: IdentifySlangInput) {
  try {
    const result = await identifySlang(input);
    return result;
  } catch (error) {
    console.error("Error analyzing slang:", error);
    throw new Error("Failed to analyze slang. The AI model may be temporarily unavailable.");
  }
}
