import { z } from 'zod';

export const deliveryFormSchema = z.object({
  contractor_id: z.string().uuid().nullish(),
  amount: z.coerce.number().min(0.01).nullish(),
  scheduled_at: z.string().min(1).nullish(), // format: ISO 8601
});

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;
