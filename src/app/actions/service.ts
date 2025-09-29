'use server';

import { ServiceRequestSchema, type ServiceRequestFormValues } from '@/lib/schemas';
import { z } from 'zod';
import { saveServiceRequest } from '@/lib/db';

interface ActionResult {
  success: boolean;
  message: string;
  requestId?: string;
}

export async function submitServiceRequest(values: ServiceRequestFormValues): Promise<ActionResult> {
  try {
    const validatedData = ServiceRequestSchema.parse(values);

    // Save to DB
    const record = await saveServiceRequest(validatedData);

    return {
      success: true,
      message: 'Service request submitted successfully! Your request ID is ' + record.id,
      requestId: record.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
    console.error('Error submitting service request:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
