import { z } from 'zod';

export interface Shop {
  id: string;
  code?: number;
  title: string;
}

export const shopPayloadSchema = z.object({
  id: z.string(),
  title: z.string(),
  address: z.string(),
  city: z.string(),
  code: z.number().optional(),
  created_at: z.string().optional(),
});

export type ShopPayload = z.infer<typeof shopPayloadSchema>;
