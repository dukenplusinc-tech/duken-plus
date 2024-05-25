import { z } from 'zod';

export const deviceSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  device_id: z.number(),
  issuesCount: z.number().optional(),
  os: z.string(),
});

export type Device = z.infer<typeof deviceSchema>;
