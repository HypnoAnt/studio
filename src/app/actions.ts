"use server";

import { identifySlang, type IdentifySlangInput } from "@/ai/flows/identify-slang";
import { summarizeSlangUsage, type SummarizeSlangUsageInput } from "@/ai/flows/summarize-slang-usage";

export async function analyzeSlang(input: IdentifySlangInput) {
  try {
    const result = await identifySlang(input);
    return result;
  } catch (error) {
    console.error("Error analyzing slang:", error);
    throw new Error("Failed to analyze slang. The AI model may be temporarily unavailable.");
  }
}

export async function getSlangSummary(input: SummarizeSlangUsageInput) {
  try {
    const result = await summarizeSlangUsage(input);
    return result;
  } catch (error) {
    console.error("Error getting slang summary:", error);
    throw new Error("Failed to get slang summary. The AI model may be temporarily unavailable.");
  }
}
