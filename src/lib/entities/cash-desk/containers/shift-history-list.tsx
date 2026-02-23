'use client';

import { ChevronRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/numbers/money';
import type { Database } from '@/lib/supabase/types';

type CashShiftDashboard = Database['public']['Views']['cash_shift_dashboard']['Row'];

interface ShiftHistoryItem extends CashShiftDashboard {
  shift_number: number;
  opened_at: string;
  closed_at: string | null;
  status: 'open' | 'closed' | 'auto_closed';
  opened_by?: string | null;
  closed_by?: string | null;
}

interface ShiftHistoryListProps {
  shifts: ShiftHistoryItem[];
  onShiftClick?: (shift: ShiftHistoryItem) => void;
  isLoading?: boolean;
}

export function ShiftHistoryList({
  shifts,
  onShiftClick,
  isLoading,
}: ShiftHistoryListProps) {
  const t = useTranslations('cash_desk.shifts');

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy в HH:mm', { locale: ru });
  };

  const getTotalAmount = (shift: ShiftHistoryItem) => {
    if (shift.status === 'closed' || shift.status === 'auto_closed') {
      // Use closing amounts for closed shifts
      const cash = shift.closing_cash || 0;
      const banks = shift.closing_banks && typeof shift.closing_banks === 'object'
        ? Object.values(shift.closing_banks as Record<string, number>).reduce((sum, val) => sum + val, 0)
        : 0;
      return cash + banks;
    }
    // Use current totals for open shifts
    const cash = shift.cash_total || 0;
    const bank = shift.bank_total || 0;
    return cash + bank;
  };

  const getBankAmount = (shift: ShiftHistoryItem) => {
    if (shift.status === 'closed' || shift.status === 'auto_closed') {
      // Use closing_banks from closed shift
      if (shift.closing_banks && typeof shift.closing_banks === 'object') {
        const banks = shift.closing_banks as Record<string, number>;
        return Object.values(banks).reduce((sum, val) => sum + val, 0);
      }
    }
    return shift.bank_total || 0;
  };

  const getCashAmount = (shift: ShiftHistoryItem) => {
    if (shift.status === 'closed' || shift.status === 'auto_closed') {
      return shift.closing_cash || 0;
    }
    return shift.cash_total || 0;
  };

  return (
    <div className="space-y-2">
      {shifts.map((shift) => (
        <Card
          key={shift.shift_id}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onShiftClick?.(shift)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-bold mb-2">
                  {t('shift_number')}: {shift.shift_number}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <div>
                    {t('opened')}: {formatDateTime(shift.opened_at)}
                    {shift.opened_by && (
                      <span className="ml-2 text-xs">
                        ({t('opened_by') || 'Opened by'}: {shift.opened_by})
                      </span>
                    )}
                  </div>
                  <div>
                    {t('closed')}:{' '}
                    {shift.closed_at
                      ? formatDateTime(shift.closed_at)
                      : '-'}
                    {shift.closed_by && (
                      <span className="ml-2 text-xs">
                        ({t('closed_by') || 'Closed by'}: {shift.closed_by})
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-medium flex items-center gap-1.5">
                    <Money>{getTotalAmount(shift)}</Money>
                    {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {t('bank_transfer')}: {getBankAmount(shift).toLocaleString()},{' '}
                    {t('cash')}: {getCashAmount(shift).toLocaleString()}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

