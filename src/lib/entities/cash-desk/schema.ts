import { z } from 'zod';

export const cashRegisterSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['cash', 'bank_transfer']),
  bank_name: z.string().nullable(),
  amount: z.number(),
  from: z.string().nullable(),
  added_by: z.string().nullable(),
  date: z.string().nullable(),
  shop_id: z.string().uuid(),
});

export type CashRegister = z.infer<typeof cashRegisterSchema>;

export interface BankBreakDown {
  bank_name: string;
  amount: number;
}

export type BankName = Pick<BankBreakDown, 'bank_name'>;

export interface CashStats {
  shop_id: string;
  total_amount: number;
  cash_total: number;
  bank_total: number;
  banks: BankBreakDown[];
}

export enum CashRegisterType {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

export const cashRegisterPayloadSchema = cashRegisterSchema.omit({
  id: true,
  shop_id: true,
  date: true,
});

export type CashRegisterPayload = z.infer<typeof cashRegisterPayloadSchema>;
