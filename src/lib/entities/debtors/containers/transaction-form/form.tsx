import { FC, useCallback, useEffect, useRef } from 'react';
import { IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import { useTranslations } from 'next-intl';

import {
  DebtorTransactionFormParams,
  useDebtorTransactionForm,
} from '@/lib/entities/debtors/containers/transaction-form/hooks';
import { TransactionType } from '@/lib/entities/debtors/schema';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';

export interface TransactionFormProps extends DebtorTransactionFormParams {}

export const TransactionForm: FC<DebtorTransactionFormParams> = (props) => {
  const t = useTranslations('debtor_transactions.form');

  const dialog = useModalDialog();

  const { form, isProcessing, handleSubmit } = useDebtorTransactionForm(props);

  const input = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      input.current?.setFocus();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [form]);

  const handleClose = useCallback(() => {
    dialog.close();
  }, [dialog]);

  const handleSave = useCallback(
    (type: TransactionType) => () => {
      form.setValue('transaction_type', type);
    },
    [form]
  );

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">{t('form_label_amount')}</IonLabel>
          <IonInput
            ref={input}
            type="number"
            min="1"
            step="1"
            value={form.watch('amount')}
            disabled={isProcessing}
            onIonInput={(e) =>
              form.setValue('amount', parseInt(e.detail.value!, 10))
            }
            placeholder={t('form_label_amount')}
          />
        </IonItem>
        {form.formState.errors.amount && (
          <IonLabel className="px-5" color="danger">
            {form.formState.errors.amount.message}
          </IonLabel>
        )}

        <IonItem>
          <IonLabel position="stacked">{t('form_label_description')}</IonLabel>
          <IonInput
            value={form.watch('description')}
            disabled={isProcessing}
            onIonInput={(e) => form.setValue('description', e.detail.value!)}
            placeholder={t('form_label_description')}
          />
        </IonItem>
        {form.formState.errors.description && (
          <IonLabel color="danger">
            {form.formState.errors.description.message}
          </IonLabel>
        )}

        <div className="mt-10 flex justify-between">
          <Button
            loading={isProcessing}
            variant="link"
            className="flex-1"
            onClick={handleClose}
          >
            {t('cancel_caption')}
          </Button>

          <div className="flex flex-1 justify-end">
            <Button
              disabled={isProcessing}
              type="submit"
              variant="destructive"
              className="flex-1 mr-2"
              onClick={handleSave(TransactionType.loan)}
            >
              {t('minus_caption')}
            </Button>

            <Button
              disabled={isProcessing}
              type="submit"
              variant="success"
              className="flex-1"
              onClick={handleSave(TransactionType.payback)}
            >
              {t('plus_caption')}
            </Button>
          </div>
        </div>
      </form>
    </IonList>
  );
};
