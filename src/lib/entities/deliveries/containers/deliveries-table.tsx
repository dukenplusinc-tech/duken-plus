'use client';

import { FC } from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTodayDeliveriesList } from '@/lib/entities/deliveries/hooks/useTodayDeliveriesList';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { cn } from '@/lib/utils';
import { PageHeader, PageSubHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';
import { Money } from '@/components/numbers/money';

interface Company {
  id: number;
  name: string;
  amount: string;
  accepted: boolean;
}

export const DeliveriesTable: FC = () => {
  const t = useTranslations('deliveries');

  useActivateBackButton();

  const toggleAccepted = (id: number) => {};

  const { data = [], isLoading, error } = useTodayDeliveriesList();

  const isEmpty = !isLoading && data.length === 0;

  const totalAmount = data.reduce((sum, d) => sum + d.amount_expected, 0);

  const pending = data.filter((d) => d.status === 'pending');
  const remainingCount = pending.length;
  const remainingAmount = pending.reduce(
    (sum, d) => sum + d.amount_expected,
    0
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="mb-4">{t('title')}</PageHeader>
      <PageSubHeader className="mb-4">
        <>
          <span className="block mb-2">
            <span>{data.length}</span> ФИРМ на сумму
          </span>
          <Money>{totalAmount}</Money>
        </>
      </PageSubHeader>

      {error && <ErrorScreen error={error} />}

      {isEmpty && <EmptyScreen>{t('empty_text')}</EmptyScreen>}

      {!isEmpty && (
        <div className="bg-white mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b">
            <div className="p-4 font-bold border-r">Название</div>
            <div className="p-4 font-bold border-r">Сумма</div>
            <div className="p-4 font-bold">Принять</div>
          </div>

          {/* Table Rows */}
          {data.map((delivery, index) => (
            <div
              key={delivery.id}
              className={`grid grid-cols-3 border-b ${
                index % 2 === 0 ? 'bg-success/10' : 'bg-white'
              }`}
            >
              <div className="p-4 border-r">
                {index + 1}. {delivery.contractor_name}
              </div>
              <div className="p-4 border-r font-bold text-primary">
                <Money>{delivery.amount_expected}</Money>
              </div>
              <div className="p-4">
                <div
                  className={cn(
                    delivery.status === 'accepted'
                      ? 'bg-success'
                      : 'bg-success/20',
                    'w-10 h-10 rounded flex items-center justify-center'
                  )}
                >
                  {delivery.status === 'accepted' && (
                    <Check className="text-success-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pb-4 text-l text-center">
        <span className="block mb-2">
          Осталось <span>{remainingCount}</span> ФИРМ на сумму
        </span>
        <Money>{remainingAmount}</Money>
      </div>
    </div>
  );
};
