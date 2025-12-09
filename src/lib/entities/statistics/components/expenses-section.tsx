import { useTranslations } from 'next-intl';

import { Money } from '@/components/numbers/money';
import type { DayBreakdown } from '@/lib/entities/statistics/types';

interface ExpensesSectionProps {
  expenses: DayBreakdown['expenses'];
}

export function ExpensesSection({ expenses }: ExpensesSectionProps) {
  const t = useTranslations('statistics.by_day');
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium">
        <div>{t('labels.name')}</div>
        <div className="text-right">{t('labels.amount')}</div>
      </div>

      {expenses.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          {t('empty.expenses')}
        </div>
      ) : (
        <>
          {expenses.map((expense, index) => (
            <div key={expense.id} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-200">
              <div className="text-gray-900 text-base">
                {index + 1}. {expense.type}
              </div>
              <div className="text-right">
                <span className="text-gray-900 font-semibold text-base">
                  <Money>{expense.amount}</Money>
                </span>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 px-4 py-3.5 bg-green-100">
            <div className="text-gray-900 font-semibold text-base">{t('totals.label')}</div>
            <div className="text-right">
              <span className="text-gray-900 font-bold text-base">
                <Money>{total}</Money>
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}



