'use server';

import { ServiceRequestSchema, type ServiceRequestFormValues } from '@/lib/schemas';
import { z } from 'zod';

interface ActionResult {
  success: boolean;
  message: string;
  requestId?: string;
}

export async function submitServiceRequest(values: ServiceRequestFormValues): Promise<ActionResult> {
  try {
    const validatedData = ServiceRequestSchema.parse(values);

    // Simulate API call or database interaction
    console.log('Service Request Submitted:', validatedData);
    
    // Simulate generating a request ID
    const requestId = `FA-${Date.now().toString().slice(-6)}`;

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    return {
      success: true,
      message: 'Service request submitted successfully! Your request ID is ' + requestId,
      requestId: requestId,
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
