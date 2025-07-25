'use client';

import { ReactNode } from 'react';
import { Loader } from 'lucide-react';

import { useDebtorStats } from '@/lib/entities/debtors/hooks/useDebtorStats';
import { Money } from '@/components/numbers/money';

export default function DebtorTab() {
  const { data, isLoading } = useDebtorStats();

  const renderStat = (label: string, value: ReactNode) => (
    <div className="bg-primary mb-2 text-white p-3 border-t border-primary-foreground/20">
      <div className="flex justify-center items-center">
        <span className="flex-1 text-lg">{label}</span>
        <span className="flex-1 text-xl font-semibold">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="mt-2 text-white">
      {/* Summary Block */}
      <div className="bg-primary p-4 mb-2">
        <div className="flex justify-center items-center">
          <div className="flex-1 text-lg">Всего должников</div>
          <div className="flex-1 text-3xl font-bold">
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              (data?.overdue_debtors ?? 0)
            )}
          </div>
        </div>
      </div>

      {renderStat(
        'В минусе',
        <Money>{data?.total_negative_balance ?? 0}</Money>
      )}
      {renderStat(
        'Возвратов',
        <Money>{data?.total_positive_balance ?? 0}</Money>
      )}
    </div>
  );
}
