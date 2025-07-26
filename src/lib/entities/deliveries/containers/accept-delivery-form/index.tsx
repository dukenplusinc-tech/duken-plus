'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { AcceptDeliveryForm } from '@/lib/entities/deliveries/containers/accept-delivery-form/form';
import type { DeliveryItem } from '@/lib/entities/deliveries/hooks/useTodayDeliveriesList';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useAcceptDeliveryLauncher() {
  const t = useTranslations('delivery_accept');

  const dialog = useModalDialog();

  const title = t('dialog.title');

  return useCallback(
    (delivery: DeliveryItem) => {
      dialog.launch({
        dialog: true,
        title,
        autoClose: false,
        footer: false,
        render: (
          <AcceptDeliveryForm
            id={delivery.id}
            contractorName={delivery.contractor_name}
            defaultAmount={delivery.amount_expected}
          />
        ),
      });
    },
    [dialog, title]
  );
}
