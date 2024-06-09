import { z } from 'zod';

import { roleSchema } from '@/lib/entities/roles/schema';

export const userSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  avatar_url: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  role: roleSchema,
});

export type User = z.infer<typeof userSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(3).max(255),
  role_id: z.string(),
});

export type InviteUser = z.infer<typeof inviteUserSchema>;
