import { useTranslations } from 'next-intl';

import { useDebtorStats } from '@/lib/entities/debtors/hooks/useDebtorStats';

export function OverdueWarning() {
  const t = useTranslations('debtors');
  const { isLoading, data } = useDebtorStats();

  if (isLoading || !data?.overdue_debtors) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="bg-[#FF8989] py-2 px-5 rounded-lg flex items-center justify-between">
        <p className="text-black text-2xl font-normal">
          {t('overdue_amount')}{' '}
          <span className="font-bold">{data?.overdue_debtors}</span>
        </p>
        <span className="text-black text-6xl select-none font-bold">!</span>
      </div>
    </div>
  );
}
