'use server';
/**
 * @fileOverview Retrieves information about a specific slang term.
 *
 * - displaySlangInfo - A function that retrieves information (definition, origin, age range) about a slang term.
 * - DisplaySlangInfoInput - The input type for the displaySlangInfo function.
 * - DisplaySlangInfoOutput - The return type for the displaySlangInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplaySlangInfoInputSchema = z.object({
  slang: z.string().describe('The slang term to look up information for.'),
});
export type DisplaySlangInfoInput = z.infer<typeof DisplaySlangInfoInputSchema>;

const DisplaySlangInfoOutputSchema = z.object({
  definition: z.string().describe('The definition of the slang term.'),
  countryOfOrigin: z.string().describe('The country of origin of the slang term.'),
  estimatedAgeRange: z.string().describe('The estimated age range of people who use the slang term.'),
});
export type DisplaySlangInfoOutput = z.infer<typeof DisplaySlangInfoOutputSchema>;

export async function displaySlangInfo(input: DisplaySlangInfoInput): Promise<DisplaySlangInfoOutput> {
  return displaySlangInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displaySlangInfoPrompt',
  input: {schema: DisplaySlangInfoInputSchema},
  output: {schema: DisplaySlangInfoOutputSchema},
  prompt: `You are a slang dictionary. A user will provide you with a slang term, and you must provide:

  - definition: The definition of the slang term.
  - countryOfOrigin: The country of origin of the slang term.
  - estimatedAgeRange: The estimated age range of people who use the slang term.

Slang Term: {{{slang}}}`,
});

const displaySlangInfoFlow = ai.defineFlow(
  {
    name: 'displaySlangInfoFlow',
    inputSchema: DisplaySlangInfoInputSchema,
    outputSchema: DisplaySlangInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
