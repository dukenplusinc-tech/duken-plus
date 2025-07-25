'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { AddDeliveryForm } from '@/lib/entities/suppliers/containers/add-delivery-form/form';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useAddDeliveryReqLauncher() {
  const t = useTranslations('expenses');

  const dialog = useModalDialog();

  const title = t('dialog.title');

  return useCallback(() => {
    dialog.launch({
      dialog: true,
      title,
      autoClose: false,
      footer: false,
      render: <AddDeliveryForm />,
    });
  }, [dialog, title]);
}
