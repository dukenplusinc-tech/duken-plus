import { z } from 'zod';

export const debtorSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  iin: z.string(),
  blacklist: z.boolean(),
  is_overdue: z.boolean().optional(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  max_credit_amount: z.number(),
  balance: z.number(),
  work_place: z.string().nullable(),
  additional_info: z.string().nullable(),
  shop_id: z.string(),

  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export type Debtor = z.infer<typeof debtorSchema>;

export interface DebtorStats {
  shop_id: string;
  total_debtors: number;
  overdue_debtors: number;
  total_positive_balance: number;
  total_negative_balance: number;
}

export enum TransactionType {
  payback = 'purchase',
  loan = 'loan',
}

export const debtorPayloadSchema = z.object({
  full_name: z.string().min(1),
  iin: z.string().length(12),
  phone: z.string().min(1),
  address: z.string().min(1),
  balance: z.number(),
  max_credit_amount: z.number(),
  work_place: z.string().nullable(),
  additional_info: z.string().nullable(),
  blacklist: z.boolean().optional(),
  shop_id: z.string(),
});

export type DebtorPayload = z.infer<typeof debtorPayloadSchema>;

export const debtorTransactionSchema = z.object({
  transaction_type: z.string(),
  debtor_id: z.string(),
  amount: z.number().positive(),
  description: z.string().nullable(),
  added_by: z.string().nullable(),
  transaction_date: z.string().readonly().optional(),
  debtor: debtorSchema.pick({ full_name: true }).readonly().optional(),
});

export interface DebtorTransaction {
  id: string;
  transaction_type: string;
  debtor_id: string;
  amount: number;
  description: string | null;
  added_by: string | null;
  transaction_date?: string;
  debtor: Pick<Debtor, 'full_name'>;
}

export type DebtorTransactionPayload = z.infer<typeof debtorTransactionSchema>;
