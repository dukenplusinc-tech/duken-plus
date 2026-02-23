import { FC, useCallback, useEffect, useRef } from 'react';
import { IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { BankSelect } from '@/lib/entities/cash-desk/containers/bank-select';
import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';

import {
  DebtorAddCashRegisterEntryParams,
  useAddCashRegisterEntry,
} from './hooks';

export interface AddCashRegisterEntryProps
  extends DebtorAddCashRegisterEntryParams {}

export const AddCashRegisterEntry: FC<DebtorAddCashRegisterEntryParams> = (
  props
) => {
  const { type } = props;

  const t = useTranslations('cash_desk.form');

  const dialog = useModalDialog();

  const { form, isProcessing, handleSubmit, isAddedByReady } = useAddCashRegisterEntry(props);

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

  const isBankTransfer = type == CashRegisterType.BANK_TRANSFER;

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
            autocapitalize="off"
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

        {type === CashRegisterType.BANK_TRANSFER && (
          <>
            <IonItem>
              <IonLabel position="stacked">{t('form_label_from')}</IonLabel>
              <IonInput
                value={form.watch('from')}
                disabled={isProcessing}
                autocapitalize="sentences"
                onIonInput={(e) => form.setValue('from', e.detail.value!)}
                placeholder={t('form_label_from')}
              />
            </IonItem>
            {form.formState.errors.from && (
              <IonLabel color="danger">
                {form.formState.errors.from.message}
              </IonLabel>
            )}
          </>
        )}

        {isBankTransfer && (
          <>
            <BankSelect
              value={form.watch('bank_name')}
              onChange={(value) =>
                form.setValue('bank_name', value!?.toLowerCase())
              }
              disabled={isProcessing}
            />
            {form.formState.errors.bank_name && (
              <IonLabel color="danger">
                {form.formState.errors.bank_name.message}
              </IonLabel>
            )}
          </>
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
              disabled={isProcessing || !isAddedByReady}
              type="submit"
              variant="success"
              className="flex-1"
            >
              {t('save_caption')}
            </Button>
          </div>
        </div>
      </form>
    </IonList>
  );
};
