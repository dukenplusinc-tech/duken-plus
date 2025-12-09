import { useTranslations } from 'next-intl';

import { Money } from '@/components/numbers/money';
import type { DayBreakdown } from '@/lib/entities/statistics/types';
import { formatConsignmentDate, getDaysLate } from '@/lib/entities/statistics/utils/date';

interface ConsignmentsSectionProps {
  consignments: DayBreakdown['consignments'];
  selectedDate: string;
}

export function ConsignmentsSection({ consignments, selectedDate }: ConsignmentsSectionProps) {
  const t = useTranslations('statistics.by_day');
  const total = consignments.reduce((sum, delivery) => sum + (delivery.amount_expected ?? 0), 0);

  return (
    <>
      <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 text-xs font-medium">
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
          {consignments.map((delivery, index) => {
            const actual = Number(delivery.amount_expected ?? 0);
            const acceptedDate = delivery.accepted_date
              ? formatConsignmentDate(delivery.accepted_date)
              : '—';
            const daysLate = getDaysLate(selectedDate, delivery.consignment_due_date);
            const dueDate = formatConsignmentDate(delivery.consignment_due_date);

            return (
              <div key={delivery.id} className="border-b border-gray-200">
                <div className="grid grid-cols-4 gap-2 px-4 py-3">
                  <div className="text-gray-900 text-sm font-medium">
                    {index + 1}. {delivery.contractor_title}
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
                {delivery.is_consignement && delivery.consignment_due_date && (
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
          })}

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

