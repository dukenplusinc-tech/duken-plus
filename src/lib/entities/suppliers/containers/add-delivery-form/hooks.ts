'use client';

import { useForm } from '@/lib/composite/form/useForm';
import {
  deliveryFormSchema,
  DeliveryFormValues,
} from '@/lib/entities/suppliers/schema';

const defaultValues: DeliveryFormValues = {
  amount: 0,
  contractor_id: null,
  scheduled_at: null,
};

export function useAddDeliveryRequestForm() {
  return useForm<typeof deliveryFormSchema, DeliveryFormValues>({
    defaultValues,
    request: async (values) => {
      // await createExpense(values);
    },
    schema: deliveryFormSchema,
  });
}
