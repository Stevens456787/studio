'use server';

import { z } from 'zod';
import { saveJob } from '@/lib/db';

const JobRequestSchema = z.object({
  technicianId: z.string().min(1, 'Technician id is required'),
  technicianName: z.string().min(1, 'Technician name is required'),
  source: z.string().optional(),
});

interface ActionResult {
  success: boolean;
  message: string;
  jobId?: string;
}

export async function logTechnicianJob(input: z.infer<typeof JobRequestSchema>): Promise<ActionResult> {
  try {
    const payload = JobRequestSchema.parse(input);
    const record = await saveJob(payload);
    return {
      success: true,
      jobId: record.id,
      message: `Job created for ${record.technicianName}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map(e => e.message).join(', '),
      };
    }
    console.error('Error logging technician job:', error);
    return {
      success: false,
      message: 'Could not create job. Please try again.',
    };
  }
}
