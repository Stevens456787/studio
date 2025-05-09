'use server';

import { diagnoseProblem, type DiagnoseProblemInput, type DiagnoseProblemOutput } from '@/ai/flows/diagnose-problem';
import { DiagnosticFormSchema } from '@/lib/schemas';
import { z } from 'zod';

interface ActionResult {
  success: boolean;
  message?: string;
  data?: DiagnoseProblemOutput;
}

export async function getAIDiagnosis(values: { problemDescription: string }): Promise<ActionResult> {
  try {
    const validatedInput = DiagnosticFormSchema.parse(values);
    
    const diagnosticInput: DiagnoseProblemInput = {
      problemDescription: validatedInput.problemDescription,
    };

    // Simulate a short delay for AI processing if needed, or rely on Genkit's timing
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await diagnoseProblem(diagnosticInput);

    if (!result || !result.potentialIssues) {
        return {
            success: false,
            message: 'AI diagnosis failed to return expected data. Please try again.'
        }
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
      };
    }
    console.error('Error getting AI diagnosis:', error);
    // Check if error is an object and has a message property
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) 
                         ? String(error.message) 
                         : 'An unexpected error occurred during AI diagnosis.';
    return {
      success: false,
      message: errorMessage,
    };
  }
}
