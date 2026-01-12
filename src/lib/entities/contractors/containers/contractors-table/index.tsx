'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { IonButton, IonIcon, IonList, IonSpinner } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { ContractorItem } from '@/lib/entities/contractors/containers/contractors-table/item';
import { useContractors } from '@/lib/entities/contractors/hooks/useContractors';
import { usePageRefresh } from '@/lib/hooks/usePageRefresh';
import * as fromUrl from '@/lib/url/generator';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export const ContractorsTable: FC = () => {
  const t = useTranslations('contractors');

  const { data, error, isLoading, sentinelRef, refresh } = useContractors();
  usePageRefresh(refresh);

  const sortByOptions = useMemo(
    () => [
      { label: t('sorting.by_date'), value: 'created_at' },
      { label: t('sorting.by_title'), value: 'title' },
    ],
    [t]
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        className="mb-4"
        right={
          <Link href={fromUrl.toAddContractor()}>
            <IonButton color="success">
              <IonIcon
                slot="icon-only"
                size="large"
                className="text-white"
                icon={add}
              />
            </IonButton>
          </Link>
        }
      >
        {t('title')}
      </PageHeader>

      <div className="mb-2">
        <SearchBar sortByOptions={sortByOptions} />
      </div>

      {error && <ErrorScreen error={error} />}

      {!isLoading && data.length === 0 && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
      )}

      <IonList>
        {data.map((contractor, index) => (
          <ContractorItem
            key={`${index}_${contractor.id}`}
            contractor={contractor}
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
