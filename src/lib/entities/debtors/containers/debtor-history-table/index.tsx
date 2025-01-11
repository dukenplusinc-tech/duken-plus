'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { IonList, IonSpinner } from '@ionic/react';
import { ListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { DebtorTransactionItem } from '@/lib/entities/debtors/containers/debtor-history-table/item';
import { useDebtorTransactions } from '@/lib/entities/debtors/hooks/useDebtorTransactions';
import * as fromUrl from '@/lib/url/generator';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export const DebtorHistoryTable: FC = () => {
  const t = useTranslations('debtor_transactions');

  const { data, error, isLoading, sentinelRef } = useDebtorTransactions();

  const sortByOptions = useMemo(
    () => [
      { label: t('sorting.by_date'), value: 'transaction_date' },
      { label: t('sorting.by_amount'), value: 'amount' },
    ],
    [t]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <SearchBar
          searchByField="description"
          sortByOptions={sortByOptions}
          right={
            <Link href={fromUrl.toDebtors()}>
              <Button
                variant="default"
                size="icon"
                className="bg-primary hover:bg-primary/90 h-[38px] w-[38px]"
              >
                <ListIcon />
              </Button>
            </Link>
          }
        />
      </div>

      {error && <ErrorScreen error={error} />}

      {!isLoading && data.length === 0 && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
      )}

      <IonList>
        {data.map((transaction, index) => (
          <DebtorTransactionItem
            key={`${index}_${transaction.id}`}
            transaction={transaction}
          />
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
