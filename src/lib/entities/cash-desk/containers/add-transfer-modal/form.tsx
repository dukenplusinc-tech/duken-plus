'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete } from '@/components/ui/autocomplete';
import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import {
  DebtorAddCashRegisterEntryParams,
  useAddCashRegisterEntry,
} from '@/lib/entities/cash-desk/containers/add-cash-register-entry/hooks';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useBankNames } from '@/lib/entities/cash-desk/hooks/useBankNames';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export interface AddTransferModalProps extends DebtorAddCashRegisterEntryParams {
  onSuccess?: () => void;
}

export const AddTransferModalForm: FC<AddTransferModalProps> = ({
  type,
  onSuccess,
}) => {
  const t = useTranslations('cash_desk.form');
  const tModal = useTranslations('cash_desk.shifts.add_transfer_modal');
  const dialog = useModalDialog();
  const { refresh: refreshShift } = useCurrentShift();
  const { form, isProcessing, handleSubmit } = useAddCashRegisterEntry({
    type,
  });
  const { banks } = useBankNames();

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    setSelectedBank(null);
    setShowOtherInput(false);
    form.reset();
  }, [form]);

  useEffect(() => {
    if (selectedBank && selectedBank !== 'Другое') {
      form.setValue('bank_name', selectedBank.toLowerCase());
    } else if (selectedBank === 'Другое' && !form.watch('bank_name')) {
      form.setValue('bank_name', '');
    }
  }, [selectedBank, form]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await handleSubmit(e);
        await refreshShift();
        dialog.close();
        setTimeout(() => {
          onSuccess?.();
        }, 100);
      } catch (error) {
        // Error handling is done in the hook
      }
    },
    [handleSubmit, dialog, refreshShift, onSuccess]
  );

  const getBankButtonClass = (bankName: string) => {
    const baseClass = 'flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-white font-medium transition-colors text-sm';
    const isSelected = selectedBank === bankName;
    
    if (bankName === 'Kaspi') {
      return `${baseClass} ${isSelected ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`;
    }
    if (bankName === 'Halyk') {
      return `${baseClass} ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`;
    }
    return `${baseClass} ${isSelected ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-600 hover:bg-gray-700'}`;
  };

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
      <div>
        <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
          {t('form_label_amount')}:
        </Label>
        <Input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={form.watch('amount') || ''}
          disabled={isProcessing}
          onChange={(e) =>
            form.setValue('amount', parseFloat(e.target.value) || 0)
          }
          placeholder={t('form_label_amount')}
          className="w-full"
          required
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">
          {t('form_label_bank_name')}:
        </Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedBank('Kaspi');
              setShowOtherInput(false);
            }}
            className={`${getBankButtonClass('Kaspi')} flex-1`}
          >
            <div className={`w-3 h-3 rounded-full ${selectedBank === 'Kaspi' ? 'bg-white' : 'border-2 border-white'}`}></div>
            Kaspi
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedBank('Halyk');
              setShowOtherInput(false);
            }}
            className={`${getBankButtonClass('Halyk')} flex-1`}
          >
            <div className={`w-3 h-3 rounded-full ${selectedBank === 'Halyk' ? 'bg-white' : 'border-2 border-white'}`}></div>
            Halyk
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedBank('Другое');
              setShowOtherInput(true);
            }}
            className={`${getBankButtonClass('Другое')} flex-1`}
          >
            <div className={`w-3 h-3 rounded-full ${selectedBank === 'Другое' ? 'bg-white' : 'border-2 border-white'}`}></div>
            Другое
          </button>
        </div>
        {showOtherInput && (
          <div className="mt-2">
            <Autocomplete
              options={banks}
              value={form.watch('bank_name') || ''}
              disabled={isProcessing}
              onValueChange={(value) => {
                const normalizedValue = value ? value.toLowerCase() : '';
                form.setValue('bank_name', normalizedValue);
              }}
              placeholder={t('form_label_bank_name')}
              searchPlaceholder={t('form_label_bank_search_placeholder')}
              emptyMessage={t('form_label_bank_empty')}
              allowCustomValue
              customValueMessage={(val) => `${t('form_label_bank_use')} "${val}"`}
            />
          </div>
        )}
        {form.formState.errors.bank_name && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.bank_name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="additional" className="text-sm font-medium mb-2 block">
          {tModal('additional_label')}:
        </Label>
        <Textarea
          id="additional"
          value={form.watch('from') || ''}
          disabled={isProcessing}
          onChange={(e) => form.setValue('from', e.target.value)}
          placeholder={tModal('additional_placeholder')}
          className="w-full min-h-[80px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-md text-base"
      >
        {t('save_caption')}
      </Button>
    </form>
  );
};
