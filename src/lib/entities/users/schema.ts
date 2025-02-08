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

export const userActionLogSchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  action: z.string(),
  entity: z.string(),
  entity_id: z.string(),
});

export type UserActionLog = z.infer<typeof userActionLogSchema>;

export const personalPayload = z.object({
  full_name: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().nullable(),
  language: z.string().nullable(),
});

export type PersonalPayload = z.infer<typeof personalPayload>;

export const securityPayload = z
  .object({
    pin_code: z.string().min(4).max(4).nullable().optional(),
    password: z.string().max(128).nullable().optional(),
    password_confirm: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ['password_confirm'],
  });

export type SecurityPayload = z.infer<typeof securityPayload>;
