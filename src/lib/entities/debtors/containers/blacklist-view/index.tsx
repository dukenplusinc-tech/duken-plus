'use client';

import { FC, useMemo } from 'react';
import { IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { DebtorCard } from '@/lib/entities/debtors/containers/blacklist-view/debtor-card';
import { useBlackListedDebtors } from '@/lib/entities/debtors/hooks/useDebtors';
import { useShopID } from '@/lib/entities/shop/hooks/useShop';
import { usePageRefresh } from '@/lib/hooks/usePageRefresh';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export const BlacklistView: FC = () => {
  const t = useTranslations('debtors');
  const currentShopId = useShopID();

  const { data, error, isLoading, refresh } = useBlackListedDebtors();
  usePageRefresh(refresh);

  const sortByOptions = useMemo(
    () => [
      { label: t('black_list.page.sorting.by_date'), value: 'created_at' },
      { label: t('black_list.page.sorting.by_name'), value: 'full_name' },
    ],
    [t]
  );

  // Group debtors by IIN, identify name variations, and deduplicate
  const { deduplicatedData, hasMultipleNames } = useMemo(() => {
    const groups = new Map<string, typeof data>();
    const multipleNames = new Set<string>();
    const seenIins = new Set<string>();
    const deduplicated: typeof data = [];

    // Group by IIN
    data.forEach((debtor) => {
      const iin = debtor.iin;
      if (!groups.has(iin)) {
        groups.set(iin, []);
      }
      groups.get(iin)!.push(debtor);
    });

    // Check for multiple unique names per IIN and deduplicate
    groups.forEach((debtors, iin) => {
      const uniqueNames = new Set(debtors.map((d) => d.full_name));
      if (uniqueNames.size > 1) {
        multipleNames.add(iin);
      }

      // Deduplicate: prefer debtor from current shop, otherwise first one
      if (!seenIins.has(iin)) {
        seenIins.add(iin);
        
        // Try to find debtor from current shop first
        const currentShopDebtor = currentShopId
          ? debtors.find((d) => d.shop_id === currentShopId)
          : null;
        
        // Use current shop debtor if found, otherwise use first one
        deduplicated.push(currentShopDebtor || debtors[0]);
      }
    });

    return {
      deduplicatedData: deduplicated,
      hasMultipleNames: multipleNames,
    };
  }, [data, currentShopId]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <PageHeader className="mb-2 px-3 sm:px-4 text-center sm:text-left">
        {t('black_list.page.title')}
      </PageHeader>

      {/* Filters (sticky on mobile for easy access) */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-3 sm:px-4 py-2 border-b">
        <SearchBar
          shop
          searchByField="full_name"
          digitsSearchByField="iin"
          sortByOptions={sortByOptions}
          placeholder={t('black_list.page.search_placeholder')}
        />
      </div>

      {/* Body */}
      <div className="flex-1 px-3 sm:px-4 py-3">
        {error && <ErrorScreen error={error} />}

        {!isLoading && deduplicatedData.length === 0 && (
          <EmptyScreen>{t('black_list.page.empty_text')}</EmptyScreen>
        )}

        {/* Responsive grid: 1 col on phones, 2 on small tablets, 3+ on larger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {deduplicatedData.map((debtor) => (
            <DebtorCard
              key={debtor.id}
              debtor={debtor}
              hasMultipleNames={hasMultipleNames.has(debtor.iin)}
            />
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center p-8">
            <IonSpinner name="dots" />
          </div>
        )}
      </div>
    </div>
  );
};
