import { FC, useCallback } from 'react';
import {
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useExpenseTypes } from '@/lib/entities/expenses/hooks/useExpenseTypes';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';

import { useExpenseForm } from './hooks';

interface ExpenseFormProps {
  id?: string | null;
}

export const ExpenseForm: FC<ExpenseFormProps> = ({ id }) => {
  const t = useTranslations('expenses.form');
  const dialog = useModalDialog();
  const { form, isProcessing, handleSubmit } = useExpenseForm({ id });
  const { types } = useExpenseTypes();

  const handleClose = useCallback(() => dialog.close(), [dialog]);

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">{t('label_type')}</IonLabel>

          <Autocomplete
            className="my-4 w-full"
            options={types}
            value={form.watch('type')}
            onValueChange={(value) => form.setValue('type', value)}
            placeholder={t('label_type_placeholder')}
            searchPlaceholder={t('label_type_search_placeholder')}
            emptyMessage={t('label_type_search_empty')}
            allowCustomValue
            customValueMessage={(val) =>
              `${t('label_type_search_add')}: \"${val}\"`
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">{t('label_amount')}</IonLabel>
          <IonInput
            type="number"
            value={form.watch('amount')}
            onIonInput={(e) =>
              form.setValue('amount', parseFloat(e.detail.value!))
            }
            disabled={isProcessing}
          />
        </IonItem>

        <IonItem className="no-ripple">
          <IonLabel position="stacked">{t('label_date')}</IonLabel>
          <div className="py-4 mx-auto">
            <IonDatetime
              presentation="date"
              value={form.watch('date')}
              onIonChange={(e) =>
                form.setValue('date', e.detail.value! as string)
              }
              disabled={isProcessing}
            />
          </div>
        </IonItem>

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
