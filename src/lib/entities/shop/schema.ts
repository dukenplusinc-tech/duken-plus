import { z } from 'zod';

export interface Shop {
  id: string;
  title: string;
}

export const shopPayloadSchema = z.object({
  id: z.string(),
  title: z.string(),
  address: z.string(),
  city: z.string(),
});

export type ShopPayload = z.infer<typeof shopPayloadSchema>;
