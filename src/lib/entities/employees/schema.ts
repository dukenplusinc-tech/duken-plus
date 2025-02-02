import { z } from 'zod';

export const employeeSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  pin_code: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  shop_id: z.string(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const createEmployeeSchema = z.object({
  full_name: z.string().min(3).max(255),
  pin_code: z.string().min(4).max(4),
});

export type CreateEmployee = z.infer<typeof createEmployeeSchema>;
