'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { FileWarning, Loader } from 'lucide-react';

import { useDebtorStats } from '@/lib/entities/debtors/hooks/useDebtorStats';
import { toDebtors } from '@/lib/url/generator';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/numbers/money';

export const DebtorTab: FC = () => {
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
    <>
      <div className="mt-2 text-white">
        {/* Summary Block */}
        <div className="bg-primary p-4 mb-2">
          <div className="flex justify-center items-center">
            <div className="flex-1 text-lg">Должников</div>
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

      <div className="px-2 mt-4 space-y-2">
        {/* Stats Button */}
        <Button
          className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto mt-2 mb-4"
          asChild
        >
          <Link href={toDebtors()}>
            <FileWarning size={28} className="mr-3" />
            <span className="text-lg">Должники</span>
          </Link>
        </Button>
      </div>
    </>
  );
};
