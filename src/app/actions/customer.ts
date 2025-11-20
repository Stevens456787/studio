'use server';

import { z } from 'zod';
import { findServiceRequestsByContact, type ServiceRequestRecord } from '@/lib/db';

const LookupSchema = z.object({
  contact: z.string().min(3, 'Enter at least 3 characters'),
});

export type CustomerRequestDTO = Omit<ServiceRequestRecord, 'preferredDate'> & {
  preferredDate: string | null;
};

export async function lookupCustomerRequests(values: { contact: string }) {
  try {
    const { contact } = LookupSchema.parse(values);
    const requests = await findServiceRequestsByContact(contact);
    return {
      success: true,
      requests: requests.map<CustomerRequestDTO>(request => ({
        ...request,
        preferredDate: request.preferredDate ? new Date(request.preferredDate).toISOString() : null,
      })),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map(e => e.message).join(', '),
      };
    }
    console.error('lookupCustomerRequests error', error);
    return {
      success: false,
      message: 'Unable to find your requests right now.',
    };
  }
}
