import { z } from 'zod';

export const vendorSchema = z.object({
    name: z.string().min(2, 'Company name is required'),
    industry: z.string().min(1, 'Please select an industry'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    contactName: z.string().min(2, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    status: z.enum(['Pending', 'Active', 'Inactive']),
    notes: z.string().optional()
});
