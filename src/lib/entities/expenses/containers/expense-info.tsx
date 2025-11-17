'use client';

import { FC, useMemo } from 'react';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { useTranslations } from 'next-intl';

import { createClient } from '@/lib/supabase/client';
import { Money } from '@/components/numbers/money';

interface ExpenseInfoProps {
  date: string; // 'YYYY-MM-DD'
}

export const ExpenseInfo: FC<ExpenseInfoProps> = ({ date }) => {
  const tRoot = useTranslations();
  const t = useTranslations('expenses.info');

  const supabase = createClient();

  const { data: expensesData = [] } = useQuery(
    supabase
      .from('expenses')
      .select('*')
      .gte('date', `${date}T00:00:00`)
      .lt('date', `${date}T23:59:59.999`),
    { revalidateOnFocus: false }
  );

  const expenses = useMemo(() => expensesData || [], [expensesData]);

  const { data: deliveriesData = [] } = useQuery(
    supabase
      .from('deliveries')
      .select('*, contractors ( title )')
      .in('status', ['pending', 'accepted'])
      .eq('expected_date', date),
    { revalidateOnFocus: false }
  );

  const deliveries = useMemo(() => deliveriesData || [], [deliveriesData]);

  // ✔ Only accepted deliveries count toward total
  const acceptedDeliveries = useMemo(
    () => deliveries.filter((d) => d.status === 'accepted'),
    [deliveries]
  );

  const total = useMemo(() => {
    const expenseSum = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    const deliverySum = acceptedDeliveries.reduce(
      (acc, d) => acc + Number(d.amount_received ?? d.amount_expected ?? 0),
      0
    );

    return expenseSum + deliverySum;
  }, [expenses, acceptedDeliveries]);

  const hasExpenses = expenses.length > 0;
  const hasDeliveries = deliveries.length > 0;

  if (!hasExpenses && !hasDeliveries) {
    return (
      <div className="text-center text-muted-foreground py-8">{t('empty')}</div>
    );
  }

  return (
    <div className="space-y-6 px-4">
      {hasDeliveries && (
        <div>
          <h2 className="text-lg font-bold mb-2">{t('deliveries_title')}</h2>
          <ul className="space-y-2">
            {deliveries.map((d) => (
              <li
                key={d.id}
                className="flex justify-between text-sm bg-muted p-2 rounded"
              >
                <span
                  className={
                    d.status === 'pending'
                      ? 'text-destructive font-semibold'
                      : ''
                  }
                >
                  {d.contractors?.title ?? '—'}
                  {d.status === 'pending' &&
                    ` (${tRoot('statistics.delivery.status.pending')})`}
                </span>

                <Money
                  className={
                    d.status === 'pending' ? 'text-destructive font-bold' : ''
                  }
                >
                  {d.amount_expected}
                </Money>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasExpenses && (
        <div>
          <h2 className="text-lg font-bold mb-2">{t('expenses_title')}</h2>
          <ul className="space-y-2">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="flex justify-between text-sm bg-muted p-2 rounded"
              >
                <span>{e.type}</span>
                <Money>{e.amount}</Money>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-6 pb-4 text-xl font-bold">
        {t('total')}: <Money>{total}</Money>
      </div>
    </div>
  );
};
