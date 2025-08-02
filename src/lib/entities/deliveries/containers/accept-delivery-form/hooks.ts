'use client';

import { mutate } from 'swr';

import { useForm } from '@/lib/composite/form/useForm';
import { acceptDelivery } from '@/lib/entities/deliveries/actions/acceptDelivery';
import {
  acceptDeliveryFormSchema,
  AcceptDeliveryFormValues,
} from '@/lib/entities/deliveries/schema';

export function useAcceptDeliveryForm({
  id,
  defaultAmount,
}: {
  id: string;
  defaultAmount: number;
}) {
  return useForm<typeof acceptDeliveryFormSchema, AcceptDeliveryFormValues>({
    defaultValues: {
      amount_received: defaultAmount,
      is_consignement: false,
      consignment_due_date: null,
      reschedule: false,
      reschedule_expected_date: null,
    },
    schema: acceptDeliveryFormSchema,
    request: async (values) => {
      await acceptDelivery(id, values);

      await mutate(['todayDeliveriesList', false]);
      await mutate(['todayDeliveriesList', true]);
    },
  });
}
