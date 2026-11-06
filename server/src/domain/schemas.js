import { z } from 'zod';

export const URGENCY = ['emergency', 'see_doctor', 'community', 'instant'];

export const triageInputSchema = z.object({
  concern: z.string().trim().min(3, 'Please describe your concern').max(1000),
  ageMonths: z.number().int().min(0).max(216),
});

export const triageResultSchema = z.object({
  urgency: z.enum(URGENCY),
  category: z.string(),
  summary: z.string(),
  advice: z.array(z.string()).min(1),
  redFlags: z.array(z.string()),
  disclaimer: z.string(),
});
