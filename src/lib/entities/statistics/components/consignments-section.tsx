import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

import { Money } from '@/components/numbers/money';
import type { DayBreakdown } from '@/lib/entities/statistics/types';
import { formatConsignmentDate, getDaysLate } from '@/lib/entities/statistics/utils/date';

interface ConsignmentsSectionProps {
  consignments: DayBreakdown['consignments'];
  selectedDate: string;
}

export function ConsignmentsSection({ consignments, selectedDate }: ConsignmentsSectionProps) {
  const t = useTranslations('statistics.by_day');
  const tConsignment = useTranslations('consignment');

  // Separate paid and unpaid consignments
  const { paid, unpaid } = useMemo(() => {
    const paidList: typeof consignments = [];
    const unpaidList: typeof consignments = [];

    consignments.forEach((delivery) => {
      if (delivery.consignment_status === 'closed') {
        paidList.push(delivery);
      } else {
        unpaidList.push(delivery);
      }
    });

    return { paid: paidList, unpaid: unpaidList };
  }, [consignments]);

  const total = consignments.reduce((sum, delivery) => sum + (delivery.amount_expected ?? 0), 0);

  const renderConsignment = (delivery: typeof consignments[0], index: number, isPaid: boolean) => {
    const actual = Number(delivery.amount_expected ?? 0);
    const acceptedDate = delivery.accepted_date
      ? formatConsignmentDate(delivery.accepted_date)
      : '—';
    const daysLate = getDaysLate(selectedDate, delivery.consignment_due_date);
    const dueDate = formatConsignmentDate(delivery.consignment_due_date);

    return (
      <div key={delivery.id} className="border-b border-gray-200">
        {/* Mobile layout: stacked */}
        <div className="md:hidden px-4 py-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm font-medium flex items-center gap-2 flex-wrap">
                <span className="text-gray-500">{index + 1}.</span>
                <span className="truncate">{delivery.contractor_title}</span>
                {isPaid && (
                  <span className="flex items-center gap-1 text-green-600 text-xs whitespace-nowrap">
                    <Check size={14} />
                    <span>{tConsignment('paid')}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                <span>{t('labels.accepted_date')}: {acceptedDate}</span>
                {daysLate !== null && (
                  <span>{t('labels.overdue')}: {t('labels.days', { count: daysLate })}</span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-gray-900 font-semibold text-base">
                <Money>{actual}</Money>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop layout: grid */}
        <div className="hidden md:grid grid-cols-4 gap-2 px-4 py-3">
          <div className="text-gray-900 text-sm font-medium flex items-center gap-2">
            {index + 1}. {delivery.contractor_title}
            {isPaid && (
              <span className="flex items-center gap-1 text-green-600 text-xs">
                <Check size={14} />
                <span>{tConsignment('paid')}</span>
              </span>
            )}
          </div>
          <div className="text-gray-600 text-xs">{acceptedDate}</div>
          <div className="text-gray-600 text-xs">
            {daysLate !== null ? t('labels.days', { count: daysLate }) : '—'}
          </div>
          <div className="text-right">
            <span className="text-gray-900 font-semibold text-sm">
              <Money>{actual}</Money>
            </span>
          </div>
        </div>

        {delivery.is_consignement && delivery.consignment_due_date && !isPaid && (
          <div className="px-4 pb-3 bg-red-100">
            <p className="text-red-700 text-xs font-medium">
              {t('consignment.label', {
                amount: actual,
                date: dueDate,
              })}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop header */}
      <div className="hidden md:grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 text-xs font-medium">
        <div>{t('labels.supplier')}</div>
        <div>{t('labels.accepted_date')}</div>
        <div>{t('labels.overdue')}</div>
        <div className="text-right">{t('labels.amount')}</div>
      </div>

      {consignments.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          {t('empty.consignments')}
        </div>
      ) : (
        <>
          {/* Unpaid consignments first */}
          {unpaid.map((delivery, index) => renderConsignment(delivery, index, false))}
          
          {/* Paid consignments */}
          {paid.map((delivery, index) => renderConsignment(delivery, unpaid.length + index, true))}

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

