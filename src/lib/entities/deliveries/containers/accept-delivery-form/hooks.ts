'use client';

import { useTranslations } from 'next-intl';
import { mutate } from 'swr';

import { useForm } from '@/lib/composite/form/useForm';
import { acceptDelivery } from '@/lib/entities/deliveries/actions/acceptDelivery';
import { cancelDelivery } from '@/lib/entities/deliveries/actions/cancelDelivery';
import {
  acceptDeliveryFormSchema,
  AcceptDeliveryFormValues,
} from '@/lib/entities/deliveries/schema';
import { useConfirmAction } from '@/lib/primitives/dialog/confirm/confirm';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

async function refresh() {
  await Promise.all([
    mutate(['todayDeliveriesList', false]),
    mutate(['todayDeliveriesList', true]),
  ]);
}

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

      await refresh();
    },
  });
}

export const useDeclineDelivery = (id: string) => {
  const t = useTranslations('delivery_accept.form');

  const dialog = useModalDialog();

  return useConfirmAction({
    title: 'Отменить доставку?',
    description: `Фирма доставила не тот товар или он испорченный?\nНе хотите принимать товар?`,
    acceptCaption: 'Отменить доставку',
    cancelCaption: 'Нет, все впорядке',
    onConfirm: async () => {
      await cancelDelivery(id);

      await refresh();

      dialog.close();
    },
  });
};
