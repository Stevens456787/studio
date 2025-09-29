"use server";

import {
  diagnoseProblem,
  type DiagnoseProblemInput,
  type DiagnoseProblemOutput,
} from "@/ai/flows/diagnose-problem";
import { DiagnosticFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { saveDiagnostic } from "@/lib/db";

interface ActionResult {
  success: boolean;
  message?: string;
  data?: DiagnoseProblemOutput;
  diagnosticId?: string;
}

export async function getAIDiagnosis(
  values: { problemDescription: string; mediaDataUri?: string }
): Promise<ActionResult> {
  try {
    const validatedInput = DiagnosticFormSchema.parse(values);

    const diagnosticInput: DiagnoseProblemInput = {
      problemDescription: validatedInput.problemDescription,
      mediaDataUri: validatedInput.mediaDataUri,
    };

    const result = await diagnoseProblem(diagnosticInput);

    if (!result || !result.potentialIssues) {
      return {
        success: false,
        message: "AI diagnosis failed to return expected data. Please try again.",
      };
    }

    // Save diagnostic with AI output
    const record = await saveDiagnostic(validatedInput, result);

    return {
      success: true,
      data: result,
      diagnosticId: record.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed: " + error.errors.map((e) => e.message).join(", "),
      };
    }
    console.error("Error getting AI diagnosis:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as any).message)
        : "An unexpected error occurred during AI diagnosis.";
    return {
      success: false,
      message: errorMessage,
    };
  }
}
