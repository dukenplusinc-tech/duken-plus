'use client';

import { FC, useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useDeleteDelivery } from '@/lib/entities/deliveries/hooks/useDeleteDelivery';
import { useTodayDeliveriesList } from '@/lib/entities/deliveries/hooks/useTodayDeliveriesList';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageHeader, PageSubHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';
import { Money } from '@/components/numbers/money';

export const DeliveriesTable: FC = () => {
  const t = useTranslations('deliveries');

  useActivateBackButton();

  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const {
    data = [],
    isLoading,
    error,
  } = useTodayDeliveriesList(showOverdueOnly);

  const deleteDialog = useDeleteDelivery();

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
            <span>{data.length}</span> {t('header.firms_total')}
          </span>
          <Money>{totalAmount}</Money>
        </>
      </PageSubHeader>

      <div className="mb-2 mx-auto text-center max-w-md">
        <Button
          onClick={() => setShowOverdueOnly((prev) => !prev)}
          className="text-sm"
        >
          {showOverdueOnly ? t('filter.show_all') : t('filter.show_overdue')}
        </Button>
      </div>

      {error && <ErrorScreen error={error} />}
      {isEmpty && <EmptyScreen>{t('empty_text')}</EmptyScreen>}

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
                delivery.status === 'due' && 'bg-red-100'
              )}
            >
              <div className="p-4 border-r">
                {index + 1}. {delivery.contractor_name}
                {delivery.status == 'due' && (
                  <span className="mt-2 block text-sm">
                    {t('row.planned_for')}{' '}
                    <span className="font-bold">{delivery.expected_date}</span>
                  </span>
                )}
              </div>

              <div className="p-4 border-r font-bold text-primary">
                <Money>{delivery.amount_expected}</Money>
              </div>

              <div className="p-4 flex items-center gap-2">
                {delivery.status === 'accepted' ? (
                  <div
                    className="w-10 h-10 bg-success rounded flex items-center justify-center"
                    title={t('row.accepted')}
                  >
                    <Check className="text-success-foreground" />
                  </div>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="success"
                      className="w-10 h-10"
                      onClick={() => console.log(delivery.id)}
                      title={t('actions.accept')}
                    >
                      <Check />
                    </Button>

                    {delivery.status === 'due' && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="w-10 h-10"
                        disabled={deleteDialog.processing}
                        onClick={() => deleteDialog.onDelete(delivery.id)}
                        title={t('actions.delete')}
                      >
                        🗑️
                      </Button>
                    )}
                  </>
                )}
              </div>
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
    </div>
  );
};
