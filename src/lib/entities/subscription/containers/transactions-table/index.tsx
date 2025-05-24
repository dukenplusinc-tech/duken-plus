'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { IonList, IonSpinner } from '@ionic/react';
import { ListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { SubscriptionPaymentItem } from '@/lib/entities/subscription/containers/transactions-table/transaction-item';
import { useSubscriptionPayments } from '@/lib/entities/subscription/hooks/useSubscriptionPayments';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import * as fromUrl from '@/lib/url/generator';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export const TransactionsTable: FC = () => {
  useActivateBackButton();

  const t = useTranslations('subscription.transactions');

  const { data, error, isLoading, sentinelRef } = useSubscriptionPayments();

  const sortByOptions = useMemo(
    () => [
      { label: t('sorting.by_date'), value: 'created_at' },
      { label: t('sorting.by_amount'), value: 'amount' },
    ],
    [t]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <SearchBar
          searchByField="description"
          defaultSortBy="transaction_date"
          sortByOptions={sortByOptions}
          right={
            <Link href={fromUrl.toSubscription()}>
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
        {data.map((payment, index) => (
          <SubscriptionPaymentItem
            key={`${index}_${payment.id}`}
            payment={payment}
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
