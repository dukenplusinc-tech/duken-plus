import { FC, useCallback } from 'react';
import {
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useContractorList } from '@/lib/entities/contractors/hooks/useContractorList';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';

import { useAddDeliveryRequestForm } from './hooks';

export const AddDeliveryForm: FC = () => {
  const t = useTranslations('delivery_request.form');

  const dialog = useModalDialog();
  const { data: contractors } = useContractorList();

  const { form, isProcessing, handleSubmit } = useAddDeliveryRequestForm();

  const handleClose = useCallback(() => dialog.close(), [dialog]);

  const canSubmit = Boolean(form.watch('contractor_id'));

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">{t('label_type')}</IonLabel>

          <Autocomplete
            className="my-4 w-full"
            options={contractors}
            value={form.watch('contractor_id') || ''}
            onValueChange={(value) => form.setValue('contractor_id', value)}
            placeholder={t('label_type_placeholder')}
            searchPlaceholder={t('label_type_search_placeholder')}
            emptyMessage={t('label_type_search_empty')}
            cancelButtonText={t('cancel')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">{t('label_amount')}</IonLabel>
          <IonInput
            type="number"
            min={0}
            value={form.watch('amount_expected')}
            autocapitalize="off"
            onIonInput={(e) =>
              form.setValue('amount_expected', parseFloat(e.detail.value!))
            }
            disabled={isProcessing}
          />
        </IonItem>

        <IonItem className="no-ripple">
          <IonLabel position="stacked">{t('label_date')}</IonLabel>
          <div className="py-4 mx-auto">
            <IonDatetime
              presentation="date"
              value={form.watch('expected_date')}
              onIonChange={(e) =>
                form.setValue('expected_date', e.detail.value! as string)
              }
              disabled={isProcessing}
            />
          </div>
        </IonItem>

        <div className="mt-6 flex justify-between">
          <Button variant="link" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={!canSubmit} loading={isProcessing}>
            {t('submit')}
          </Button>
        </div>
      </form>
    </IonList>
  );
};
