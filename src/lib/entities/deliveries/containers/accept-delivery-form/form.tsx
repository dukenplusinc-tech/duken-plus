'use client';

import { FC, useCallback } from 'react';
import {
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';

import { useAcceptDeliveryForm } from './hooks';

export const AcceptDeliveryForm: FC<{
  id: string;
  contractorName: string;
  defaultAmount: number;
}> = ({ id, contractorName, defaultAmount }) => {
  const t = useTranslations('delivery_accept.form');

  const dialog = useModalDialog();
  const { form, isProcessing, handleSubmit } = useAcceptDeliveryForm({
    id,
    defaultAmount,
  });

  const handleClose = useCallback(() => dialog.close(), [dialog]);

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">{t('label_type')}</IonLabel>
          <div className="py-2 font-bold">{contractorName}</div>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">{t('label_amount')}</IonLabel>
          <IonInput
            type="number"
            value={form.watch('amount_received')}
            onIonInput={(e) =>
              form.setValue('amount_received', parseFloat(e.detail.value!))
            }
            disabled={isProcessing}
          />
        </IonItem>

        <IonItem lines="none">
          <IonLabel>{t('label_is_consignement')}</IonLabel>
          <IonToggle
            checked={form.watch('is_consignement')}
            onIonChange={(e) =>
              form.setValue('is_consignement', e.detail.checked)
            }
            disabled={isProcessing}
          />
        </IonItem>

        {form.watch('is_consignement') && (
          <IonItem className="no-ripple">
            <IonLabel position="stacked">
              {t('label_consignment_date')}
            </IonLabel>
            <div className="py-4 mx-auto">
              <IonDatetime
                presentation="date"
                value={form.watch('consignment_due_date')}
                onIonChange={(e) =>
                  form.setValue(
                    'consignment_due_date',
                    e.detail.value! as string
                  )
                }
                disabled={isProcessing}
              />
            </div>
          </IonItem>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="link" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" loading={isProcessing}>
            {t('submit')}
          </Button>
        </div>
      </form>
    </IonList>
  );
};
