'use client';

import { FC, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { DeliveryActions } from '@/lib/entities/deliveries/containers/deliveries-table/actions';
import { useTodayDeliveriesList } from '@/lib/entities/deliveries/hooks/useTodayDeliveriesList';
import { useOverdueDeliveriesList } from '@/lib/entities/deliveries/hooks/useOverdueDeliveriesList';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { cn } from '@/lib/utils';
import { PageHeader, PageSubHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';
import { Money } from '@/components/numbers/money';

const calculateDaysOverdue = (dateString: string) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const expectedDate = new Date(dateString);
  const diffMs = todayStart.getTime() - expectedDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

export const DeliveriesTable: FC = () => {
  const t = useTranslations('deliveries');

  useActivateBackButton();

  const {
    data = [],
    isLoading,
    error,
  } = useTodayDeliveriesList();

  const {
    data: overdueData = [],
    isLoading: isOverdueLoading,
    error: overdueError,
  } = useOverdueDeliveriesList();

  const isEmpty = !isLoading && data.length === 0;
  const totalAmount = data.reduce(
    (sum, d) => sum + (d.amount_received || d.amount_expected),
    0
  );

  const pending = data.filter((d) => d.status === 'pending');
  const remainingCount = pending.length;
  const remainingAmount = pending.reduce(
    (sum, d) => sum + d.amount_expected,
    0
  );

  const overdueAmount = useMemo(
    () =>
      overdueData.reduce(
        (sum, d) => sum + (d.amount_received || d.amount_expected),
        0
      ),
    [overdueData]
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="mb-4">{t('title')}</PageHeader>

      <PageSubHeader className="mb-4">
        <>
          <span className="block mb-2">
            <span>{data.length}</span> {t('header.firms_total')}
          </span>
          <Money>{totalAmount}</Money>
        </>
      </PageSubHeader>

      {error && <ErrorScreen error={error} />}
      {isEmpty && <EmptyScreen>{t('empty_text')}</EmptyScreen>}
      {overdueError && <ErrorScreen error={overdueError} />}

      {!isEmpty && (
        <div className="bg-white mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b font-bold bg-muted text-muted-foreground">
            <div className="p-4 border-r">{t('table.name')}</div>
            <div className="p-4 border-r">{t('table.amount')}</div>
            <div className="p-4">{t('table.actions')}</div>
          </div>

          {/* Table Rows */}
          {data.map((delivery, index) => (
            <div
              key={delivery.id}
              className={cn(
                'grid grid-cols-3 border-b transition-colors',
                delivery.status === 'accepted' && 'bg-green-100',
                delivery.status === 'pending' && 'bg-green-50',
                delivery.status === 'due' && 'bg-red-100',
                delivery.status === 'canceled' && 'bg-red-100'
              )}
            >
              <div className="p-4 border-r">
                {index + 1}. {delivery.contractor_name}
                {delivery.status == 'due' && (
                  <span className="mt-2 block text-sm">
                    {t('row.planned_for')}
                    <span className="font-bold">{delivery.expected_date}</span>
                  </span>
                )}
                {delivery.status == 'canceled' && (
                  <span className="mt-2 block font-bold text-md">
                    {t('row.declined')}
                  </span>
                )}
              </div>

              <div className="p-4 border-r font-bold text-primary">
                <Money
                  className={cn(
                    delivery.amount_received &&
                      delivery.amount_received !== delivery.amount_expected &&
                      'line-through'
                  )}
                >
                  {delivery.amount_expected}
                </Money>

                {delivery.amount_received &&
                  delivery.amount_received !== delivery.amount_expected && (
                    <Money className="block">
                      {delivery.amount_received || delivery.amount_expected}
                    </Money>
                  )}
              </div>

              <DeliveryActions delivery={delivery} />
            </div>
          ))}
        </div>
      )}

      {remainingCount > 0 && (
        <div className="mt-4 pb-4 text-l text-center">
          <span className="block mb-2">
            {t('footer.remaining')} <span>{remainingCount}</span>{' '}
            {t('footer.firms_remaining')}
          </span>
          <Money>{remainingAmount}</Money>
        </div>
      )}

      {!isOverdueLoading && overdueData.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <PageSubHeader className="mb-4 bg-destructive text-destructive-foreground">
            {t('overdue.header', { count: overdueData.length })}
          </PageSubHeader>

          <div className="bg-white">
            <div className="grid grid-cols-3 border-b font-bold bg-destructive/10 text-destructive">
              <div className="p-4 border-r">{t('overdue.table.name')}</div>
              <div className="p-4 border-r">{t('overdue.table.amount')}</div>
              <div className="p-4">{t('overdue.table.actions')}</div>
            </div>

            {overdueData.map((delivery, index) => {
              const daysOverdue = calculateDaysOverdue(delivery.expected_date);

              return (
                <div
                  key={`overdue-${delivery.id}`}
                  className="grid grid-cols-3 border-b bg-red-50"
                >
                  <div className="p-4 border-r">
                    {index + 1}. {delivery.contractor_name}
                    <span className="mt-2 block text-sm">
                      {t('overdue.planned_for')}{' '}
                      <span className="font-semibold">
                        {delivery.expected_date}
                      </span>
                    </span>
                    <span className="inline-flex mt-2 px-2 py-1 text-xs text-[10px] font-semibold bg-destructive text-white rounded-full whitespace-nowrap">
                      {t('overdue.days', { count: daysOverdue })}
                    </span>
                  </div>

                  <div className="p-4 border-r font-bold text-primary">
                    <Money>{delivery.amount_expected}</Money>
                  </div>

                  <DeliveryActions delivery={delivery} />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4 mb-8">
            {/* <span className="block text-destructive font-semibold text-base">
              {t('overdue.summary', { count: overdueData.length })}
            </span>
            <Money className="text-destructive text-xl font-bold">
              {overdueAmount}
            </Money> */}
          </div>
        </div>
      )}
    </div>
  );
};
