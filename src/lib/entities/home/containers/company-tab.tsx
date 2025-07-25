'use client';

import { FC } from 'react';
import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTodayDeliveries } from '@/lib/entities/deliveries/hooks/useTodayDeliveries';
import { useTotalExpenses } from '@/lib/entities/expenses/hooks/useTotalExpenses';
import { Money } from '@/components/numbers/money';

const ExpenseSummary: FC = () => {
  const t = useTranslations('expenses');
  const { totalToday, loading } = useTotalExpenses();

  return (
    <div className="bg-primary text-white p-3 border-t border-primary-foreground/20">
      <div className="text-center">
        {t('summary.today_label')} &nbsp;
        {loading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          `${totalToday} тг`
        )}
      </div>
    </div>
  );
};

export default function CompanyTab() {
  const { count, totalExpected, remainingCompanies, remainingAmount, loading } =
    useTodayDeliveries();

  const renderSummary = () => {
    if (loading) {
      return (
        <div className="bg-primary p-4 mb-2">
          <Loader className="h-4 w-4 animate-spin mx-auto" />
        </div>
      );
    }

    return (
      <>
        <div className="bg-primary p-4 mb-2">
          <div className="flex justify-center items-center">
            <div className="flex-1 text-lg">На сегодня</div>
            <div className="flex-1 text-3xl font-bold">{count} ФИРМ</div>
          </div>
          <div className="flex justify-center items-center mt-2">
            <div className="flex-1 text-lg">На сумму</div>
            <Money className="flex-1 text-3xl font-bold">{totalExpected}</Money>
          </div>
        </div>

        {/* Remaining Companies */}
        <div className="bg-primary mb-2 text-white p-3 border-t border-primary-foreground/20">
          <div className="text-center">
            Осталось: {remainingCompanies} фирмы на сумму{' '}
            <Money>{remainingAmount}</Money>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mt-2">
      {/* Summary Banner */}
      <div className="text-white">
        {renderSummary()}

        <ExpenseSummary />
      </div>
    </div>
  );
}
