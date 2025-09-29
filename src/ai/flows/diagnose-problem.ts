
'use server';

/**
 * @fileOverview An AI-powered diagnostic tool for technicians.
 *
 * - diagnoseProblem - A function that analyzes the user's problem description and an optional photo or video to identify potential issues with the equipment.
 * - DiagnoseProblemInput - The input type for the diagnoseProblem function.
 * - DiagnoseProblemOutput - The return type for the diagnoseProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseProblemInputSchema = z.object({
    problemDescription: z.string().describe('The user provided description of the problem.'),
    mediaDataUri: z.string().optional().describe(
        "An optional photo or short video (e.g., up to 1 minute) of the equipment problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseProblemInput = z.infer<typeof DiagnoseProblemInputSchema>;

const DiagnoseProblemOutputSchema = z.object({
    potentialIssues: z
        .array(z.string())
        .describe('A list of potential issues with the equipment based on the user description and/or media. Provide this list in English.'),
    requiredTools: z
        .array(z.string())
        .describe('A list of tools that might be required to fix the potential issues. Provide this list in English.'),
});
export type DiagnoseProblemOutput = z.infer<typeof DiagnoseProblemOutputSchema>;

export async function diagnoseProblem(input: DiagnoseProblemInput): Promise<DiagnoseProblemOutput> {
    return diagnoseProblemFlow(input);
}

const prompt = ai.definePrompt({
    name: 'diagnoseProblemPrompt',
    input: { schema: DiagnoseProblemInputSchema },
    output: { schema: DiagnoseProblemOutputSchema },
    prompt: `You are an expert technician specializing in diagnosing equipment problems based on user descriptions and optional photos or short videos.

You will use the user's description, and if provided, a photo or video frames, to identify potential issues with the equipment and suggest the tools that might be required to fix those issues.
Consider the visual information from the photo or video if it's available. If a video is provided, analyze its frames for diagnostic clues.

Please ensure all your responses, including the lists of potential issues and required tools, are entirely in English.

User Description: {{{problemDescription}}}
{{#if mediaDataUri}}
Media (Photo or Video) of the problem:
{{media url=mediaDataUri}}
{{/if}}`,
});

const diagnoseProblemFlow = ai.defineFlow(
    {
        name: 'diagnoseProblemFlow',
        inputSchema: DiagnoseProblemInputSchema,
        outputSchema: DiagnoseProblemOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
