import { useTranslations } from 'next-intl';

import { Money } from '@/components/numbers/money';
import type { DayBreakdown } from '@/lib/entities/statistics/types';

interface NotAcceptedSectionProps {
  deliveries: DayBreakdown['others'];
}

export function NotAcceptedSection({ deliveries }: NotAcceptedSectionProps) {
  const t = useTranslations('statistics.by_day');
  const tStatus = useTranslations('statistics.delivery.status');
  const total = deliveries.reduce((sum, delivery) => sum + (delivery.amount_expected ?? 0), 0);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium">
        <div>{t('labels.name')}</div>
        <div>{t('labels.reason')}</div>
        <div className="text-right">{t('labels.amount')}</div>
      </div>

      {deliveries.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          {t('empty.notAccepted')}
        </div>
      ) : (
        <>
          {deliveries.map((delivery, index) => (
            <div key={delivery.id} className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-200">
              <div className="text-gray-900 text-base line-through decoration-red-500">
                {index + 1}. {delivery.contractor_title}
              </div>
              <div className="text-gray-600 text-sm">
                {tStatus(delivery.status as any)}
              </div>
              <div className="text-right">
                <span className="text-gray-900 font-semibold text-base line-through decoration-red-500">
                  <Money>{delivery.amount_expected ?? 0}</Money>
                </span>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4 px-4 py-3.5 bg-green-100">
            <div className="col-span-2 text-gray-900 font-semibold text-base">{t('totals.label')}</div>
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



