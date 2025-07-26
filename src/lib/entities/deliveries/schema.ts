import { z } from 'zod';

export const deliveryFormSchema = z.object({
  contractor_id: z.string().uuid().nullish(),
  amount_expected: z.coerce.number().min(0.01).nullish(),
  expected_date: z.string().min(1).nullish(), // format: ISO 8601
  expected_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format')
    .nullish(), // HH:MM
});

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

export const acceptDeliveryFormSchema = z.object({
  amount_received: z.coerce.number().min(0.01),
  is_consignement: z.boolean().default(false),
  consignment_due_date: z.string().datetime().optional().nullable(),
});

acceptDeliveryFormSchema.refine(
  (val) => !val.is_consignement || !!val.consignment_due_date,
  { message: 'Дата консигнации обязательна', path: ['consignment_due_date'] }
);

export type AcceptDeliveryFormValues = z.infer<typeof acceptDeliveryFormSchema>;
