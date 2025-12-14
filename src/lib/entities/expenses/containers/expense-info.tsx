'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { useExpenseInfo } from '@/lib/entities/expenses/hooks/useExpenseInfo';
import { Money } from '@/components/numbers/money';

interface ExpenseInfoProps {
  date: string; // 'YYYY-MM-DD'
}

export const ExpenseInfo: FC<ExpenseInfoProps> = ({ date }) => {
  const tRoot = useTranslations();
  const t = useTranslations('expenses.info');

  const { expenses, deliveries, total, getDeliveryAmount } = useExpenseInfo(date);

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
                  {getDeliveryAmount(d)}
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
