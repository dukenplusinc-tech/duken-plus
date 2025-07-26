import { useTranslations } from 'next-intl';
import { mutate } from 'swr';

import { markConsignmentPaid } from '@/lib/entities/deliveries/actions/markConsignmentPaid';
import { useConfirmAction } from '@/lib/primitives/dialog/confirm/confirm';

export function useMarkAsPaidConsigment(id?: string) {
  const t = useTranslations('consignment.mark_as_paid');

  return useConfirmAction({
    title: t('title'),
    description: t('description'),
    acceptCaption: t('acceptCaption'),
    cancelCaption: t('cancelCaption'),
    onConfirm: async (ids) => {
      const targets = [id, ids].flat().filter(Boolean) as string[];

      if (targets?.length) {
        await Promise.all(
          targets
            .filter(Boolean)
            .map((targetId) => markConsignmentPaid(targetId))
        );

        await mutate('consignmentDeliveries');
      }
    },
  });
}
