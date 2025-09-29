import { z } from 'zod';

export const ServiceRequestSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  problemDescription: z.string().min(10, { message: "Problem description must be at least 10 characters." }),
  preferredDate: z.date({ required_error: "Preferred date is required." }),
  preferredTimeSlot: z.string({ required_error: "Preferred time slot is required." }),
});

export type ServiceRequestFormValues = z.infer<typeof ServiceRequestSchema>;

export const DiagnosticFormSchema = z.object({
    problemDescription: z.string().min(10, { message: "Problem description must be at least 10 characters long to diagnose effectively." }),
    mediaDataUri: z.string().optional().describe("An optional photo or short video (e.g., up to 1 minute, 50MB) of the equipment problem, as a data URI. Excpected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;
