'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import CashEntriesTabContent from '@/lib/entities/cash-desk/containers/cash-entries-tabs/tab-content';
import { useCashDeskEntries } from '@/lib/entities/cash-desk/hooks/useCashDeskEntries';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const CashEntriesTabs: FC = () => {
  const t = useTranslations('cash_desk.tabs');
  const {
    data: all,
    isLoading: loadingAll,
    sentinelRef: sentinelAll,
  } = useCashDeskEntries();
  const {
    data: cash,
    isLoading: loadingCash,
    sentinelRef: sentinelCash,
  } = useCashDeskEntries('cash');
  const {
    data: bank,
    isLoading: loadingBank,
    sentinelRef: sentinelBank,
  } = useCashDeskEntries('bank_transfer');

  return (
    <Tabs defaultValue="all" className="mb-4">
      <TabsList className="grid grid-cols-3 mb-2">
        <TabsTrigger value="all">{t('all')}</TabsTrigger>
        <TabsTrigger value="cash">{t('cash')}</TabsTrigger>
        <TabsTrigger value="bank">{t('bank')}</TabsTrigger>
      </TabsList>

      <CashEntriesTabContent
        value="all"
        transactions={all}
        loading={loadingAll}
        sentinelRef={sentinelAll}
      />

      <CashEntriesTabContent
        value="cash"
        transactions={cash}
        loading={loadingCash}
        sentinelRef={sentinelCash}
      />

      <CashEntriesTabContent
        value="bank"
        transactions={bank}
        loading={loadingBank}
        sentinelRef={sentinelBank}
      />
    </Tabs>
  );
};
