import { z } from 'zod';

export const contractorSchema = z.object({
  id: z.string(),
  title: z.string(),
  supervisor: z.string(),
  supervisor_phone: z.string(),
  sales_representative: z.string(),
  sales_representative_phone: z.string(),
  address: z.string(),
  contract: z.string().nullable(),
  note: z.string(),
  shop_id: z.string(),

  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export type Contractor = z.infer<typeof contractorSchema>;

export const contractorPayloadSchema = z.object({
  title: z.string().min(1),
  supervisor: z.string(),
  supervisor_phone: z.string(),
  sales_representative: z.string(),
  sales_representative_phone: z.string(),
  address: z.string().min(1),
  note: z.string(),
});

export type ContractorPayload = z.infer<typeof contractorPayloadSchema>;
