'use client';

import { useForm } from '@/lib/composite/form/useForm';
import { createDelivery } from '@/lib/entities/deliveries/actions/createDelivery';
import {
  deliveryFormSchema,
  DeliveryFormValues,
} from '@/lib/entities/deliveries/schema';

const defaultValues: DeliveryFormValues = {
  amount_expected: 0,
  contractor_id: null,
  expected_date: null,
};

export function useAddDeliveryRequestForm() {
  return useForm<typeof deliveryFormSchema, DeliveryFormValues>({
    defaultValues,
    request: async (values) => {
      await createDelivery(values);
    },
    schema: deliveryFormSchema,
  });
}
