'use client';

import { FC } from 'react';
import { Calendar, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useConsignmentDeliveriesList } from '@/lib/entities/deliveries/hooks/useConsignmentDeliveriesList';
import { useMarkAsPaidConsigment } from '@/lib/entities/deliveries/hooks/useMarkAsPaidConsigment';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';
import { FormatDate } from '@/components/date/format-date';
import { Money } from '@/components/numbers/money';

export const ConsignmentTable: FC = () => {
  useActivateBackButton();

  const t = useTranslations('consignment');

  const { data = [], isLoading, error } = useConsignmentDeliveriesList();
  const markAsPaid = useMarkAsPaidConsigment();

  const isEmpty = !isLoading && data.length === 0;

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="mb-4">{t('title')}</PageHeader>

      {error && <ErrorScreen error={error} />}
      {isEmpty && <EmptyScreen>{t('empty_text')}</EmptyScreen>}

      {!isLoading &&
        data.map((delivery) => (
          <div
            key={delivery.id}
            className="border-b px-4 py-3 flex justify-between items-center hover:bg-muted/50 transition"
          >
            <div>
              <div className="font-bold">{delivery.contractor_name}</div>
              <div className="text-muted-foreground text-sm flex items-center gap-2">
                <Calendar size={14} />
                <FormatDate format="PP">
                  {delivery.consignment_due_date}
                </FormatDate>
              </div>
            </div>

            <div className="text-right">
              <Money className="text-lg font-bold">
                {delivery.amount_expected}
              </Money>
              {delivery.consignment_status === 'closed' ? (
                <div className="text-success text-sm flex items-center gap-1 justify-end">
                  <Check size={14} /> {t('paid')}
                </div>
              ) : (
                delivery.consignment_status === 'open' && (
                  <Button
                    variant="default"
                    className="mt-4 text-sm block"
                    disabled={markAsPaid.processing}
                    onClick={() => markAsPaid.onAction(delivery.id)}
                  >
                    {t('mark_as_paid_caption')}
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
