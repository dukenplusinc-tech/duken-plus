import { FC, useCallback, useEffect, useRef } from 'react';
import { IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import { Minus, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  DebtorTransactionFormParams,
  useDebtorTransactionForm,
} from '@/lib/entities/debtors/containers/transaction-form/hooks';
import { TransactionType } from '@/lib/entities/debtors/schema';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/numbers/money';

export interface TransactionFormProps extends DebtorTransactionFormParams {
  prefillForm?: boolean;
}

/** Digits-only, no decimals/exponent. */
function sanitizeIntegerInput(raw: string | number | null | undefined): string {
  const s = (raw ?? '').toString();
  const digits = s.replace(/[^\d]/g, '');
  return digits.replace(/^0+(?=\d)/, '');
}

export const TransactionForm: FC<TransactionFormProps> = (props) => {
  // NOTE: original prop name was `balance` – keep it as-is to preserve old behavior
  const { balance: currentBalance = 0, prefillForm = false, ...rest } = props;

  const t = useTranslations('debtor_transactions.form');
  const dialog = useModalDialog();
  const { form, isProcessing, handleSubmit } = useDebtorTransactionForm(rest);

  const input = useRef<HTMLIonInputElement>(null);

  // Autofocus
  useEffect(() => {
    const timer = setTimeout(() => input.current?.setFocus(), 300);
    return () => clearTimeout(timer);
  }, [form]);

  // Preserve previous logic: prefill amount with full balance for quick payback
  useEffect(() => {
    const base = Number.isFinite(Number(currentBalance))
      ? Math.abs(Number(currentBalance))
      : 0;
    const hasAmount = Number(form.getValues('amount') ?? 0) > 0;
    if (!hasAmount && base > 0 && prefillForm) {
      form.setValue('amount', base);
    }
  }, [currentBalance, form, prefillForm]);

  const handleClose = useCallback(() => dialog.close(), [dialog]);

  const handleSave = useCallback(
    (type: TransactionType) => () => {
      form.setValue('transaction_type', type);
    },
    [form]
  );

  // Amount state (sanitized digits)
  const watched = form.watch('amount') as string | number | undefined;
  const sanitized = sanitizeIntegerInput(watched ?? '');

  const onAmountInput = (val: string | number | null | undefined) => {
    const clean = sanitizeIntegerInput(val ?? '');
    form.setValue('amount', clean.length ? Number(clean) : 0);
  };

  const base = Number.isFinite(Number(currentBalance))
    ? Number(currentBalance)
    : 0;
  const amount = Number.isFinite(Number(sanitized)) ? Number(sanitized) : 0;

  // Customer asked to revert colors/logic:
  //  - Green "+" shows what it WILL BE if user presses PLUS → base + amount
  //  - Red "−" shows what it WILL BE if user presses MINUS → base − amount
  const willBePlus = base + amount;
  const willBeMinus = base - amount;

  return (
    <IonList>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">{t('form_label_amount')}</IonLabel>
          <IonInput
            ref={input}
            type="text"
            inputmode="numeric"
            pattern="\d*"
            value={sanitized}
            disabled={isProcessing}
            onIonInput={(e) => onAmountInput(e.detail.value)}
            placeholder={t('form_label_amount')}
          />
        </IonItem>

        {form.formState.errors.amount && (
          <IonLabel className="px-5" color="danger">
            {form.formState.errors.amount.message}
          </IonLabel>
        )}

        {/* preview */}
        <IonItem lines="none" className="mt-2 opacity-100" disabled>
          <IonLabel position="stacked">{t('will_be')}</IonLabel>
          <div className="w-full flex items-center justify-between gap-3 pt-4">
            {/* PLUS result (green) → base + amount */}
            <div className="flex-1 text-left">
              <div className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                <Plus className="h-6 w-6 mr-2" aria-hidden="true" />
                <span className="tabular-nums">
                  <Money emptyLabel="0">{willBePlus}</Money>
                </span>
              </div>
            </div>
            {/* MINUS result (red) → base - amount */}
            <div className="flex-1 text-right">
              <div className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold bg-red-50 text-red-700 border border-red-200">
                <Minus className="h-6 w-6 mr-2" aria-hidden="true" />
                <span className="tabular-nums">
                  <Money emptyLabel="0">{willBeMinus}</Money>
                </span>
              </div>
            </div>
          </div>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">{t('form_label_description')}</IonLabel>
          <IonInput
            value={form.watch('description') ?? ''}
            disabled={isProcessing}
            onIonInput={(e) =>
              form.setValue('description', e.detail.value ?? '')
            }
            placeholder={t('form_label_description')}
          />
        </IonItem>

        {/* Bottom buttons: + / x / - (icons only) */}
        <div className="mt-10 grid grid-cols-3 gap-2 items-center">
          <Button
            disabled={isProcessing}
            type="submit"
            variant="success"
            className="w-full flex items-center justify-center"
            aria-label={t('plus_caption')}
            onClick={handleSave(TransactionType.payback)}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button
            loading={isProcessing}
            variant="link"
            className="w-full flex items-center justify-center"
            onClick={handleClose}
            type="button"
            aria-label={t('cancel_caption')}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            disabled={isProcessing}
            type="submit"
            variant="destructive"
            className="w-full flex items-center justify-center"
            aria-label={t('minus_caption')}
            onClick={handleSave(TransactionType.loan)}
          >
            <Minus className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </IonList>
  );
};
