'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Money } from '@/components/numbers/money';
import { closeShift } from '@/lib/entities/cash-desk/actions/closeShift';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useShiftTransactions } from '@/lib/entities/cash-desk/hooks/useShiftTransactions';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { useAddedBy } from '@/lib/entities/debtors/hooks/useAddedBy';

export interface CloseShiftDialogFormProps {
  shiftId: string;
  onSuccess?: () => void;
}

export function CloseShiftDialogForm({
  shiftId,
  onSuccess,
}: CloseShiftDialogFormProps) {
  const t = useTranslations('cash_desk.shifts.close_shift_dialog');
  const dialog = useModalDialog();
  const { data: currentShift } = useCurrentShift();
  const { data: transactions } = useShiftTransactions(shiftId);
  const addedBy = useAddedBy();
  const [cashAmount, setCashAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate bank totals grouped by standard banks (Kaspi, Halyk, Other)
  const bankTotals = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        kaspi: 0,
        halyk: 0,
        other: 0,
      };
    }

    const totals = {
      kaspi: 0,
      halyk: 0,
      other: 0,
    };

    transactions
      .filter((t) => t.type === 'bank_transfer' && t.bank_name)
      .forEach((t) => {
        const bankName = t.bank_name!.toLowerCase();
        const amount = typeof t.amount === 'number' ? t.amount : parseFloat(String(t.amount)) || 0;
        
        if (bankName.includes('kaspi') || bankName.includes('каспи')) {
          totals.kaspi += amount;
        } else if (bankName.includes('halyk') || bankName.includes('халык')) {
          totals.halyk += amount;
        } else {
          totals.other += amount;
        }
      });

    return totals;
  }, [transactions]);

  const totalBankAmount = useMemo(() => {
    return bankTotals.kaspi + bankTotals.halyk + bankTotals.other;
  }, [bankTotals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate shiftId
    if (!shiftId || shiftId.trim() === '') {
      setError(t('error') || 'Invalid shift ID');
      return;
    }

    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount < 0) {
      setError(t('cash_amount_placeholder'));
      return;
    }

    setIsLoading(true);
    try {
      await closeShift(shiftId, amount, addedBy);
      setCashAmount('');
      dialog.close();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getBankButtonClass = (bankName: 'kaspi' | 'halyk' | 'other') => {
    if (bankName === 'kaspi') {
      return 'bg-red-600';
    }
    if (bankName === 'halyk') {
      return 'bg-green-600';
    }
    return 'bg-blue-600';
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* Cash Amount Input */}
      <div>
        <Label htmlFor="cash-amount" className="text-sm font-medium mb-2 block">
          {t('cash_amount_label')}
        </Label>
        <Input
          id="cash-amount"
          type="number"
          step="0.01"
          min="0"
          value={cashAmount}
          onChange={(e) => setCashAmount(e.target.value)}
          placeholder={t('cash_amount_placeholder')}
          className="w-full"
          required
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>

      {/* Bank Transfers Section */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          {t('by_banks_label')}
        </Label>
        <div className="flex gap-2">
          <div className={`${getBankButtonClass('kaspi')} flex-1 flex flex-col items-center justify-center px-3 py-3 rounded-md text-white font-medium`}>
            <div className="text-sm">Kaspi</div>
            <Money className="text-white text-base font-semibold">{bankTotals.kaspi}</Money>
          </div>
          <div className={`${getBankButtonClass('halyk')} flex-1 flex flex-col items-center justify-center px-3 py-3 rounded-md text-white font-medium`}>
            <div className="text-sm">Halyk</div>
            <Money className="text-white text-base font-semibold">{bankTotals.halyk}</Money>
          </div>
          <div className={`${getBankButtonClass('other')} flex-1 flex flex-col items-center justify-center px-3 py-3 rounded-md text-white font-medium`}>
            <div className="text-sm">Другое</div>
            <Money className="text-white text-base font-semibold">{bankTotals.other}</Money>
          </div>
        </div>
        <div className="mt-2 text-sm font-medium">
          {t('total_bank_transfer_label')} <Money>{totalBankAmount}</Money>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-md text-lg"
      >
        {t('submit')}
      </Button>
    </form>
  );
}
