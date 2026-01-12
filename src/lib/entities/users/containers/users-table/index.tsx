'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { IonButton, IonIcon, IonList, IonSpinner } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { UserItem } from '@/lib/entities/users/containers/users-table/user-item';
import { useUsers } from '@/lib/entities/users/hooks/useUsers';
import { usePageRefresh } from '@/lib/hooks/usePageRefresh';
import * as fromUrl from '@/lib/url/generator';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';

export const UsersTable: FC = () => {
  const t = useTranslations('users');

  const { data, isLoading, sentinelRef, refresh } = useUsers();
  usePageRefresh(refresh);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        right={
          <Link href={fromUrl.toInvite()}>
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

      {!isLoading && !data.length && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IonSpinner name="dots" />
        </div>
      ) : (
        <IonList>
          {data.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </IonList>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};
