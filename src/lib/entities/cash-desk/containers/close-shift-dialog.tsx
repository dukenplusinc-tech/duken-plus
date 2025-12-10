'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Money } from '@/components/numbers/money';
import { closeShift } from '@/lib/entities/cash-desk/actions/closeShift';
import { useCurrentShift } from '@/lib/entities/cash-desk/hooks/useCurrentShift';
import { useShiftTransactions } from '@/lib/entities/cash-desk/hooks/useShiftTransactions';

interface CloseShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftId: string;
  onSuccess: () => void;
}

export function CloseShiftDialog({
  open,
  onOpenChange,
  shiftId,
  onSuccess,
}: CloseShiftDialogProps) {
  const t = useTranslations('cash_desk.shifts.close_shift_dialog');
  const { data: currentShift } = useCurrentShift();
  const { data: transactions } = useShiftTransactions(shiftId);
  const [cashAmount, setCashAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate bank totals from transactions (filtered by current shift)
  const bankTotals = useMemo(() => {
    if (!transactions?.data) return {};

    const totals: Record<string, number> = {};
    transactions.data
      .filter((t) => t.type === 'bank_transfer' && t.bank_name && t.shift_id === shiftId)
      .forEach((t) => {
        const bankName = t.bank_name!;
        const amount = typeof t.amount === 'number' ? t.amount : parseFloat(String(t.amount)) || 0;
        totals[bankName] = (totals[bankName] || 0) + amount;
      });

    return totals;
  }, [transactions, shiftId]);

  const totalBankAmount = useMemo(() => {
    return Object.values(bankTotals).reduce((sum, amount) => {
      const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;
      return sum + numAmount;
    }, 0);
  }, [bankTotals]);

  // Calculate cash flow from transactions (filtered by current shift)
  const cashFlow = useMemo(() => {
    if (!transactions?.data) return 0;

    return transactions.data
      .filter((t) => t.type === 'cash' && t.shift_id === shiftId)
      .reduce((sum, t) => {
        const amount = typeof t.amount === 'number' ? t.amount : parseFloat(String(t.amount)) || 0;
        return sum + amount;
      }, 0);
  }, [transactions, shiftId]);

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
      await closeShift(shiftId, amount);
      setCashAmount('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getBankButtonClass = (bankName: string) => {
    const normalized = bankName.toLowerCase();
    if (normalized.includes('kaspi') || normalized.includes('каспи')) {
      return 'bg-red-600';
    }
    if (normalized.includes('halyk') || normalized.includes('халык')) {
      return 'bg-green-600';
    }
    return 'bg-blue-600';
  };

  const formatBankName = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes('kaspi') || normalized.includes('каспи')) {
      return 'Kaspi';
    }
    if (normalized.includes('halyk') || normalized.includes('халык')) {
      return 'Halyk';
    }
    return 'Другое';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-0 max-w-md">
        <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <DialogTitle className="text-white text-lg font-semibold">
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Cash Flow Section */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('cash_flow_label') || 'Cash Flow (Current Shift)'}:
            </Label>
            <div className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-blue-600 text-white font-medium mb-2">
              <span>{t('cash_flow_label') || 'Cash Flow'}</span>
              <Money className="text-white">{cashFlow}</Money>
            </div>
          </div>

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
              {t('by_banks_label')}:
            </Label>
            <div className="space-y-2">
              {Object.entries(bankTotals).map(([bankName, amount]) => {
                const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;
                return (
                  <div
                    key={bankName}
                    className={`${getBankButtonClass(bankName)} w-full flex items-center justify-between px-4 py-3 rounded-md text-white font-medium`}
                  >
                    <span>{formatBankName(bankName)}</span>
                    <Money className="text-white">{numAmount}</Money>
                  </div>
                );
              })}
              {Object.keys(bankTotals).length === 0 && (
                <div className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-blue-600 text-white font-medium">
                  <span>Другое</span>
                  <Money className="text-white">0</Money>
                </div>
              )}
            </div>
            <div className="mt-2 text-sm font-medium">
              {t('total_bank_transfer_label')}: <Money>{totalBankAmount}</Money>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-md text-base"
          >
            {t('submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

