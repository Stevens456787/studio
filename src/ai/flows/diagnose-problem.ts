'use server';

/**
 * @fileOverview An AI-powered diagnostic tool for technicians.
 *
 * - diagnoseProblem - A function that analyzes the user's problem description to identify potential issues with the equipment.
 * - DiagnoseProblemInput - The input type for the diagnoseProblem function.
 * - DiagnoseProblemOutput - The return type for the diagnoseProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseProblemInputSchema = z.object({
  problemDescription: z.string().describe('The user provided description of the problem.'),
});
export type DiagnoseProblemInput = z.infer<typeof DiagnoseProblemInputSchema>;

const DiagnoseProblemOutputSchema = z.object({
  potentialIssues: z
    .array(z.string())
    .describe('A list of potential issues with the equipment based on the user description.'),
  requiredTools: z
    .array(z.string())
    .describe('A list of tools that might be required to fix the potential issues.'),
});
export type DiagnoseProblemOutput = z.infer<typeof DiagnoseProblemOutputSchema>;

export async function diagnoseProblem(input: DiagnoseProblemInput): Promise<DiagnoseProblemOutput> {
  return diagnoseProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseProblemPrompt',
  input: {schema: DiagnoseProblemInputSchema},
  output: {schema: DiagnoseProblemOutputSchema},
  prompt: `You are an expert technician specializing in diagnosing equipment problems based on user descriptions.

You will use the user's description to identify potential issues with the equipment and suggest the tools that might be required to fix those issues.

User Description: {{{problemDescription}}}`,
});

const diagnoseProblemFlow = ai.defineFlow(
  {
    name: 'diagnoseProblemFlow',
    inputSchema: DiagnoseProblemInputSchema,
    outputSchema: DiagnoseProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
