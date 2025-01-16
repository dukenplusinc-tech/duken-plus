import { FC, useEffect, useRef } from 'react';
import { IonInput, IonItem, IonLabel, IonList, IonToggle } from '@ionic/react';
import { useTranslations } from 'next-intl';

import {
  DebtorTransactionFormParams,
  useDebtorTransactionForm,
} from '@/lib/entities/debtors/containers/transaction-form/hooks';
import { TransactionType } from '@/lib/entities/debtors/schema';

export interface TransactionFormProps extends DebtorTransactionFormParams {}

export const TransactionForm: FC<DebtorTransactionFormParams> = (props) => {
  const t = useTranslations('debtor_transactions.form');

  const { form, isProcessing, handleSubmit } = useDebtorTransactionForm(props);

  const input = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      input.current?.setFocus();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [form, form.trigger]);

  const isLoan = form.watch('transaction_type') === TransactionType.loan;

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel>{t('is_loan')}</IonLabel>
          <IonToggle
            checked={isLoan}
            onIonChange={(e) =>
              form.setValue(
                'transaction_type',
                e.detail.checked
                  ? TransactionType.loan
                  : TransactionType.payback
              )
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">{t('form_label_amount')}</IonLabel>
          <IonInput
            ref={input}
            type="number"
            min="0"
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
          <IonLabel color="danger">
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

        <input type="submit" className="hidden" />
      </form>
    </IonList>
  );
};
