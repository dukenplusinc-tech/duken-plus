import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().optional().nullable(),
  shop_id: z.string().optional().nullable(),
  type: z.string(),
  amount: z.number(),
  date: z.string(), // ISO string
  created_at: z.string().optional().nullable(),
});

export type Expense = z.infer<typeof expenseSchema>;
export type ExpensePayload = Omit<Expense, 'id' | 'shop_id' | 'created_at'>;
