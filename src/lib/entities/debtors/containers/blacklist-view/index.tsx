'use client';

import { FC, useMemo } from 'react';
import { IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { DebtorCard } from '@/lib/entities/debtors/containers/blacklist-view/debtor-card';
import { useBlackListedDebtors } from '@/lib/entities/debtors/hooks/useDebtors';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export const BlacklistView: FC = () => {
  const t = useTranslations('debtors');

  const { data, error, isLoading } = useBlackListedDebtors();

  const sortByOptions = useMemo(
    () => [
      { label: t('black_list.page.sorting.by_date'), value: 'created_at' },
      { label: t('black_list.page.sorting.by_name'), value: 'full_name' },
    ],
    [t]
  );

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

        {!isLoading && data.length === 0 && (
          <EmptyScreen>{t('black_list.page.empty_text')}</EmptyScreen>
        )}

        {/* Responsive grid: 1 col on phones, 2 on small tablets, 3+ on larger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {data.map((debtor) => (
            <DebtorCard key={debtor.id} debtor={debtor} />
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
