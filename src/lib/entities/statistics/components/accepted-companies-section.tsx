import { useTranslations } from 'next-intl';

import { Money } from '@/components/numbers/money';
import type { DayBreakdown } from '@/lib/entities/statistics/types';

interface AcceptedCompaniesSectionProps {
  deliveries: DayBreakdown['accepted'];
}

export function AcceptedCompaniesSection({ deliveries }: AcceptedCompaniesSectionProps) {
  const t = useTranslations('statistics.by_day');

  const total = deliveries.reduce(
    (sum, delivery) => sum + (delivery.amount_received ?? delivery.amount_expected ?? 0),
    0
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium">
        <div>{t('labels.name')}</div>
        <div className="text-right">{t('labels.amount')}</div>
      </div>

      {deliveries.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          {t('empty.accepted')}
        </div>
      ) : (
        <>
          {deliveries.map((delivery, index) => {
            const actual = Number(delivery.amount_received ?? delivery.amount_expected ?? 0);
            const expected = Number(delivery.amount_expected ?? 0);
            const showDifference = !!delivery.amount_received && expected !== actual;

            return (
              <div key={delivery.id} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-200">
                <div>
                  <p className="text-gray-900 text-base">
                    {index + 1}. {delivery.contractor_title}
                  </p>
                  {showDifference && (
                    <p className="text-xs text-red-500 line-through mt-0.5">
                      <Money>{expected}</Money>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-gray-900 font-semibold text-base">
                    <Money>{actual}</Money>
                  </span>
                </div>
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



