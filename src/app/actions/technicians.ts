'use server';

import { z } from 'zod';
import {
  saveTechnician,
  updateTechnicianStatus,
  listTechnicians,
  findJobsByTechnician,
  type JobRecord,
  type TechnicianRecord,
} from '@/lib/db';

const OnboardingSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal('')),
  specialties: z.array(z.string()).min(1),
  coverageAreas: z.array(z.string()).min(1),
  certifications: z.array(z.string()).optional().default([]),
  availabilityStatus: z.enum(['available_now', 'next_slot', 'off']).default('available_now'),
  capacity: z.number().min(1).max(10),
  verificationDocs: z.array(z.string()).optional().default([]),
});

export async function createTechnician(input: z.infer<typeof OnboardingSchema>) {
  try {
    const data = OnboardingSchema.parse(input);
    const record = await saveTechnician({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      specialties: data.specialties,
      coverageAreas: data.coverageAreas,
      certifications: data.certifications,
      verificationDocs: data.verificationDocs,
      availabilityStatus: data.availabilityStatus,
      capacity: data.capacity,
      status: 'pending_review',
    });
    return { success: true, technicianId: record.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(', ') };
    }
    console.error('createTechnician error', error);
    return { success: false, message: 'Unable to submit onboarding. Try again.' };
  }
}

export async function setTechnicianStatus(id: string, status: TechnicianRecord['status']) {
  try {
    const updated = await updateTechnicianStatus(id, { status });
    if (!updated) return { success: false, message: 'Technician not found' };
    return { success: true, technician: updated };
  } catch (error) {
    console.error('setTechnicianStatus error', error);
    return { success: false, message: 'Failed to update status' };
  }
}

export async function getTechnicians() {
  return listTechnicians();
}

export async function getJobsForTechnician(technicianId: string): Promise<JobRecord[]> {
  return findJobsByTechnician(technicianId);
}
