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

import { useAcceptDeliveryForm, useDeclineDelivery } from './hooks';

export const AcceptDeliveryForm: FC<{
  id: string;
  contractorName: string;
  defaultAmount: number;
}> = ({ id, contractorName, defaultAmount }) => {
  const t = useTranslations('delivery_accept.form');

  const dialog = useModalDialog();

  const {
    form,
    isProcessing: isFormProcessing,
    handleSubmit,
  } = useAcceptDeliveryForm({
    id,
    defaultAmount,
  });

  const declineDelivery = useDeclineDelivery(id);

  const handleClose = useCallback(() => dialog.close(), [dialog]);

  const isProcessing = isFormProcessing || declineDelivery.processing;

  const isConsignment = form.watch('is_consignement');
  const isReschedule = form.watch('reschedule');

  const getSubmitButtonText = () => {
    if (isConsignment) {
      return t('submit_consignment');
    }
    if (isReschedule) {
      return t('submit_reschedule');
    }
    return t('submit');
  };

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
            onIonChange={(e) => {
              const val = e.detail.checked;
              form.setValue('is_consignement', val);
              // invert
              if (val) {
                form.setValue('reschedule', false);
              }
            }}
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

        <IonItem lines="none">
          <IonLabel>{t('label_reschedule')}</IonLabel>
          <IonToggle
            checked={form.watch('reschedule')}
            onIonChange={(e) => {
              const val = e.detail.checked;
              form.setValue('reschedule', val);
              if (val) form.setValue('is_consignement', false); // invert
            }}
            disabled={isProcessing}
          />
        </IonItem>

        {form.watch('reschedule') && (
          <IonItem className="no-ripple">
            <IonLabel position="stacked">
              {t('label_new_expected_date')}
            </IonLabel>
            <div className="py-4 mx-auto">
              <IonDatetime
                presentation="date"
                value={form.watch('reschedule_expected_date') ?? undefined}
                onIonChange={(e) =>
                  form.setValue(
                    'reschedule_expected_date',
                    e.detail.value! as string
                  )
                }
                disabled={isProcessing}
              />
            </div>
          </IonItem>
        )}

        <div className="mt-6 flex justify-between flex-wrap gap-2">
          <Button variant="link" onClick={handleClose}>
            {t('cancel')}
          </Button>

          <div className="flex gap-2 ml-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={declineDelivery.onAction}
              disabled={isProcessing}
              className="text-destructive"
            >
              {t('decline')}
            </Button>

            <Button type="submit" loading={isProcessing}>
              {getSubmitButtonText()}
            </Button>
          </div>
        </div>
      </form>
    </IonList>
  );
};
