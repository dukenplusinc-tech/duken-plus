'use client';

import { FC, useMemo } from 'react';
import { IonList, IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { useUserActionLogs } from '@/lib/entities/users/hooks/useUserActionLogs';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { usePageRefresh } from '@/lib/hooks/usePageRefresh';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';

import { UserActionLogItem } from './item';

export const UserActionsLog: FC<{
  user_id?: string;
  employee_id?: string;
  full_name: string;
}> = ({ user_id, employee_id, full_name }) => {
  useActivateBackButton();

  const t = useTranslations('user_logs');

  const { data, sentinelRef, isLoading, refresh } = useUserActionLogs({
    user_id,
    employee_id,
  });
  usePageRefresh(refresh);

  const sortByOptions = useMemo(
    () => [
      { label: t('sorting.by_date'), value: 'timestamp' },
      { label: t('sorting.by_title'), value: 'action' },
    ],
    [t]
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader>{t('title', { name: full_name })}</PageHeader>

      <div className="my-3">
        <SearchBar sortByOptions={sortByOptions} sortBy="timestamp" />
      </div>

      {!isLoading && !data.length && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IonSpinner name="dots" />
        </div>
      ) : (
        <IonList>
          {data.map((item, index) => (
            <UserActionLogItem
              key={`${item.id}-${item.timestamp}-${item.entity_id}-${index}`}
              item={item}
            />
          ))}
        </IonList>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};
