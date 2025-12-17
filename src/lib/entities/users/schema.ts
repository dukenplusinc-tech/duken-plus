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
  details: z.any().optional(),
});

export type UserActionLog = z.infer<typeof userActionLogSchema>;

export const personalPayload = z
  .object({
    full_name: z.string().min(3).max(255),
    email: z.string().email(),
    phone: z.string().nullable(),
    language: z.string().nullable(),
  })
  .refine(
    (data) => {
      // Allow null/empty for optional phone
      if (!data.phone || data.phone.trim() === '') return true;
      
      const phone = data.phone.trim();
      
      // Must not be just +7
      if (phone === '+7' || phone === '+') {
        return false;
      }

      // If starts with +7, validate as Kazakhstan mobile: +7 (7XX) XXX-XX-XX
      if (phone.startsWith('+7')) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        // Must be +7 followed by 10 digits, and first digit after +7 should be 7
        return /^\+7\d{10}$/.test(cleanPhone) && cleanPhone[2] === '7';
      }

      // For landline numbers (not starting with +7), just check it has some digits
      // Allow at least 6 digits for landline numbers
      const digitsOnly = phone.replace(/\D/g, '');
      return digitsOnly.length >= 6;
    },
    {
      path: ['phone'],
      params: { i18nKey: 'zod.custom.phone_invalid' },
    }
  );

export type PersonalPayload = z.infer<typeof personalPayload>;

export const securityPayload = z
  .object({
    pin_code: z.string().min(4).max(4).nullable().optional(),
    password: z.string().max(128).nullable().optional(),
    password_confirm: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ['password_confirm'],
    params: { i18nKey: 'zod.custom.password_mismatch' },
  });

export type SecurityPayload = z.infer<typeof securityPayload>;
