'use client';

import { FC } from 'react';
import { Check, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAcceptDeliveryLauncher } from '@/lib/entities/deliveries/containers/accept-delivery-form';
import { useDeleteDelivery } from '@/lib/entities/deliveries/hooks/useDeleteDelivery';
import type { DeliveryItem } from '@/lib/entities/deliveries/hooks/useTodayDeliveriesList';
import { Button } from '@/components/ui/button';

export const DeliveryActions: FC<{ delivery: DeliveryItem }> = ({
  delivery,
}) => {
  const t = useTranslations('deliveries');

  const acceptDelivery = useAcceptDeliveryLauncher();
  const deleteDialog = useDeleteDelivery();

  return (
    <div className="p-4 flex items-center gap-2">
      {delivery.status === 'accepted' ? (
        <div
          className="w-10 h-10 bg-success rounded flex items-center justify-center"
          title={t('row.accepted')}
        >
          <Check className="text-success-foreground" />
        </div>
      ) : (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10"
            onClick={() => acceptDelivery(delivery)}
            title={t('actions.accept')}
          >
            <Square />
          </Button>

          {delivery.status === 'due' && (
            <Button
              size="icon"
              variant="destructive"
              className="w-10 h-10"
              disabled={deleteDialog.processing}
              onClick={() => deleteDialog.onDelete(delivery.id)}
              title={t('actions.delete')}
            >
              🗑️
            </Button>
          )}
        </>
      )}
    </div>
  );
};
