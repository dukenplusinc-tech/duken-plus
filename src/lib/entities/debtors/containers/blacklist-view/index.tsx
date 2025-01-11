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
    <div className="flex flex-col h-full">
      <PageHeader className="mb-4">{t('black_list.page.title')}</PageHeader>

      <div className="mb-4">
        <SearchBar
          shop
          searchByField="full_name"
          digitsSearchByField="iin"
          sortByOptions={sortByOptions}
          placeholder={t('black_list.page.search_placeholder')}
        />
      </div>

      {error && <ErrorScreen error={error} />}

      {!isLoading && data.length === 0 && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
      )}

      <div className="grid grid-cols-3 gap-6">
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
  );
};
