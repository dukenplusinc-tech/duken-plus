'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { IonButton, IonList, IonSpinner } from '@ionic/react';
import { HistoryIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFiltersCtx } from '@/lib/composite/filters/context';
import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { DebtorItem } from '@/lib/entities/debtors/containers/debtors-table/item';
import { OverdueWarning } from '@/lib/entities/debtors/containers/overdue-warning';
import { TotalAmounts } from '@/lib/entities/debtors/containers/total-amounts';
import { useDebtors } from '@/lib/entities/debtors/hooks/useDebtors';
import { usePageRefresh } from '@/lib/hooks/usePageRefresh';
import * as fromUrl from '@/lib/url/generator';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export const DebtorsTable: FC = () => {
  const t = useTranslations('debtors');

  const { data, error, isLoading, sentinelRef, refresh } = useDebtors();
  usePageRefresh(refresh);

  const sortByOptions = useMemo(
    () => [
      { label: t('sorting.by_date'), value: 'created_at' },
      { label: t('sorting.by_full_name'), value: 'full_name' },
      { label: t('sorting.by_balance'), value: 'balance' },
    ],
    [t]
  );

  const { applied } = useFiltersCtx();

  const emptyMessage = useMemo(() => {
    const isSearch = applied.find(
      (value) =>
        value.key === 'full_name' && value?.search && value.search.length > 0
    );

    return isSearch ? 'search_empty' : 'empty_text';
  }, [applied]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Link href={fromUrl.toAddDebtor()}>
              <IonButton expand="block" color="success">
                <span className="text-white">{t('title_add')}</span>
              </IonButton>
            </Link>
          </div>
          <TotalAmounts />
        </div>
      </div>

      <OverdueWarning />

      <div className="mb-2">
        <SearchBar
          searchByField="full_name"
          sortByOptions={sortByOptions}
          right={
            <Link href={fromUrl.toDebtorHistory()}>
              <Button
                variant="default"
                size="icon"
                className="bg-primary hover:bg-primary/90 h-[38px] w-[38px]"
              >
                <HistoryIcon />
              </Button>
            </Link>
          }
        />
      </div>

      {error && <ErrorScreen error={error} />}

      {!isLoading && data.length === 0 && (
        <EmptyScreen>{t(emptyMessage)}</EmptyScreen>
      )}

      <IonList>
        {data.map((item, index) => (
          <DebtorItem key={`${index}_${item.id}`} debtor={item} />
        ))}
      </IonList>

      {isLoading && (
        <div className="flex justify-center p-8">
          <IonSpinner name="dots" />
        </div>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};
