'use server';
/**
 * @fileOverview Summarizes the overall slang usage in a block of text.
 *
 * - summarizeSlangUsage - A function that provides a high-level summary of slang usage.
 * - SummarizeSlangUsageInput - The input type for the summarizeSlangUsage function.
 * - SummarizeSlangUsageOutput - The return type for the summarizeSlangUsage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSlangUsageInputSchema = z.object({
  text: z.string().describe('The text containing slang to be summarized.'),
});
export type SummarizeSlangUsageInput = z.infer<typeof SummarizeSlangUsageInputSchema>;

const SummarizeSlangUsageOutputSchema = z.object({
  summaryCountryOfOrigin: z
    .string()
    .describe(
      'A summary of the most likely country or region of origin for the slang used in the text.'
    ),
  summaryEstimatedAgeRange: z
    .string()
    .describe('A summary of the estimated age range of the people who typically use the slang in the text.'),
});
export type SummarizeSlangUsageOutput = z.infer<typeof SummarizeSlangUsageOutputSchema>;

export async function summarizeSlangUsage(
  input: SummarizeSlangUsageInput
): Promise<SummarizeSlangUsageOutput> {
  return summarizeSlangUsageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSlangUsagePrompt',
  input: {schema: SummarizeSlangUsageInputSchema},
  output: {schema: SummarizeSlangUsageOutputSchema},
  prompt: `You are an expert in sociolinguistics. Analyze the provided text and the slang within it to give a high-level summary. Based on all the slang terms present, determine the most likely country of origin and the general age demographic of the speaker.

Provide a concise, one-sentence summary for each field. For example, "Primarily American (US) with some British (UK) influence." or "Likely Gen Z or young Millennials (16-28 years old)."

Text: {{{text}}}`,
});

const summarizeSlangUsageFlow = ai.defineFlow(
  {
    name: 'summarizeSlangUsageFlow',
    inputSchema: SummarizeSlangUsageInputSchema,
    outputSchema: SummarizeSlangUsageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
