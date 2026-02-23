'use client';

import { useTranslations } from 'next-intl';
import { ru } from 'date-fns/locale';
import { formatTZ } from '@/lib/utils/tz';

import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/numbers/money';
import TransactionList from '@/lib/entities/cash-desk/containers/transaction-list';
import { useShiftTransactions } from '@/lib/entities/cash-desk/hooks/useShiftTransactions';
import { useQuery } from '@/lib/supabase/query';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import type { Database } from '@/lib/supabase/types';

type CashShiftDashboard = Database['public']['Views']['cash_shift_dashboard']['Row'];

interface ShiftDetailProps {
  shiftId: string;
}

export default function ShiftDetail({ shiftId }: ShiftDetailProps) {
  useActivateBackButton();
  const t = useTranslations('cash_desk.shifts');
  const { data: transactions, isLoading: isLoadingTransactions } =
    useShiftTransactions(shiftId);

  const { data: shiftData, isLoading: isLoadingShift } = useQuery<
    CashShiftDashboard[]
  >(
    'cash_shift_dashboard',
    `
      shift_id,
      shift_number,
      status,
      opened_at,
      closes_at,
      closed_at,
      closing_cash,
      closing_banks,
      cash_total,
      bank_total
    `,
    {
      filters: [
        {
          key: 'shift_id',
          eq: shiftId,
        },
      ],
    }
  );

  // Get shift user info from cash_shifts table
  const { data: shiftUserData } = useQuery<Array<{
    opened_by: string | null;
    closed_by: string | null;
  }>>(
    'cash_shifts',
    'opened_by, closed_by',
    {
      filters: [
        {
          key: 'id',
          eq: shiftId,
        },
      ],
    }
  );

  const shift = shiftData?.[0];
  const shiftUser = shiftUserData?.[0];
  
  const openedByName = shiftUser?.opened_by || null;
  const closedByName = shiftUser?.closed_by || null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatTZ(date, 'dd.MM.yyyy в HH:mm', { locale: ru });
  };

  const getTotalAmount = () => {
    if (!shift) return 0;
    if (shift.status === 'closed' || shift.status === 'auto_closed') {
      const cash = shift.closing_cash || 0;
      const banks = shift.closing_banks
        ? Object.values(shift.closing_banks as Record<string, number>).reduce(
            (sum, val) => sum + val,
            0
          )
        : 0;
      return cash + banks;
    }
    return (shift.cash_total || 0) + (shift.bank_total || 0);
  };

  const getBankAmount = () => {
    if (!shift) return 0;
    if (shift.status === 'closed' || shift.status === 'auto_closed') {
      if (shift.closing_banks && typeof shift.closing_banks === 'object') {
        const banks = shift.closing_banks as Record<string, number>;
        return Object.values(banks).reduce((sum, val) => sum + val, 0);
      }
      return 0;
    }
    return shift.bank_total || 0;
  };

  const getCashAmount = () => {
    if (!shift) return 0;
    if (shift.status === 'closed' || shift.status === 'auto_closed') {
      return shift.closing_cash || 0;
    }
    return shift.cash_total || 0;
  };

  if (isLoadingShift) {
    return (
      <main className="flex min-h-screen flex-col p-2">
        <div className="text-center">{t('loading')}</div>
      </main>
    );
  }

  if (!shift) {
    return (
      <main className="flex min-h-screen flex-col p-2">
        <div className="text-center">{t('shift_not_found')}</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-2">
        {/* Shift Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="font-bold text-lg mb-2">
                {t('shift_number')}: {shift.shift_number}
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  {t('opened')}: {formatDateTime(shift.opened_at || '')}
                  {openedByName && (
                    <span className="ml-2 text-xs">
                      ({t('opened_by') || 'Opened by'}: {openedByName})
                    </span>
                  )}
                </div>
                {shift.closed_at && (
                  <div>
                    {t('closed')}: {formatDateTime(shift.closed_at)}
                    {closedByName && (
                      <span className="ml-2 text-xs">
                        ({t('closed_by') || 'Closed by'}: {closedByName})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-3">
                  <div className="text-sm opacity-80">{t('cash')}</div>
                  <Money className="text-xl font-bold">
                    {getCashAmount()}
                  </Money>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-3">
                  <div className="text-sm opacity-80">{t('bank_transfer')}</div>
                  <Money className="text-xl font-bold">
                    {getBankAmount()}
                  </Money>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                {t('amount')}
              </div>
              <Money className="text-2xl font-bold text-primary">
                {getTotalAmount()}
              </Money>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">{t('transactions')}</h2>
          {isLoadingTransactions ? (
            <div className="text-center py-4">{t('loading_transactions')}</div>
          ) : transactions && transactions.length > 0 ? (
            <TransactionList transactions={transactions} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('no_transactions')}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

