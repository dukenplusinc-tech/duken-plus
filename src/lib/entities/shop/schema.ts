import { z } from 'zod';

export const shopPayloadSchema = z.object({
  title: z.string(),
  address: z.string(),
  city: z.string(),
});

export type ShopPayload = z.infer<typeof shopPayloadSchema>;
