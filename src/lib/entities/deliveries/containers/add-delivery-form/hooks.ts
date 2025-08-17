'use client';

import { useForm } from '@/lib/composite/form/useForm';
import { createDelivery } from '@/lib/entities/deliveries/actions/createDelivery';
import { todayISO } from '@/lib/entities/deliveries/containers/calendar/time-utils';
import {
  deliveryFormSchema,
  DeliveryFormValues,
} from '@/lib/entities/deliveries/schema';
import { useRefreshHomeData } from '@/lib/entities/home/hooks/useRefreshHomeData';

const defaultValues: DeliveryFormValues = {
  amount_expected: 0,
  contractor_id: null,
  expected_date: todayISO(),
};

export function useAddDeliveryRequestForm() {
  const refresh = useRefreshHomeData();

  return useForm<typeof deliveryFormSchema, DeliveryFormValues>({
    defaultValues,
    request: async (values) => {
      await createDelivery(values);

      await refresh();
    },
    schema: deliveryFormSchema,
  });
}
