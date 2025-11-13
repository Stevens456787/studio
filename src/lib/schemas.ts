import { z } from 'zod';

export const SERVICE_CATEGORY_OPTIONS = [
  'HVAC',
  'Electrical',
  'Plumbing',
  'Appliances',
  'Smart Home',
] as const;

export const CONTACT_METHOD_OPTIONS = ['phone', 'sms', 'whatsapp', 'email'] as const;

const ServiceCategoryEnum = z.enum(SERVICE_CATEGORY_OPTIONS);
const ContactMethodEnum = z.enum(CONTACT_METHOD_OPTIONS);

export const ServiceRequestSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  problemDescription: z.string().min(10, { message: "Problem description must be at least 10 characters." }),
  preferredDate: z.date({ required_error: "Preferred date is required." }),
  preferredTimeSlot: z.string({ required_error: "Preferred time slot is required." }),
  serviceCategories: z.array(ServiceCategoryEnum).min(1, { message: "Select at least one service category." }),
  preferredContactMethod: ContactMethodEnum,
  estimatedBudget: z.number().min(0, { message: "Budget cannot be negative." }).max(2000, { message: "Budget must be under $2,000 for online booking. Contact support for larger projects." }),
  mediaDataUri: z.string().optional(),
});

export type ServiceRequestFormValues = z.infer<typeof ServiceRequestSchema>;
export type ServiceCategory = z.infer<typeof ServiceCategoryEnum>;
export type ContactMethod = z.infer<typeof ContactMethodEnum>;

export const DiagnosticFormSchema = z.object({
    problemDescription: z.string().min(10, { message: "Problem description must be at least 10 characters long to diagnose effectively." }),
    mediaDataUri: z.string().optional().describe("An optional photo or short video (e.g., up to 1 minute, 50MB) of the equipment problem, as a data URI. Excpected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;
