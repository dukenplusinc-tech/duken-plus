'use client';

import type { FC } from 'react';
import { IonItem, IonLabel, IonList, IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useUserActionLogs } from '@/lib/entities/users/hooks/useUserActionLogs';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { FormatDate } from '@/components/date/format-date';

export const UserActionsLog: FC<{ id: string; full_name: string }> = ({
  id,
  full_name,
}) => {
  useActivateBackButton();

  const t = useTranslations('user_logs');

  const { data, sentinelRef, isLoading } = useUserActionLogs(id);

  return (
    <div className="flex flex-col h-full">
      <PageHeader>{t('title', { name: full_name })}</PageHeader>

      {!isLoading && !data.length && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IonSpinner name="dots" />
        </div>
      ) : (
        <IonList>
          {data.map((item) => (
            <IonItem key={item.id} lines="full">
              {/* Action Badge */}
              <IonLabel>
                <p className="truncate text-sm text-muted">
                  Entity ID: {item.entity_id}
                </p>

                <Badge className="mr-2">{item.action}</Badge>
                <Badge variant="outline">{item.entity}</Badge>
              </IonLabel>

              {/* Timestamp */}
              <IonLabel slot="end" className="ion-text-end">
                <p className="font-medium">
                  <FormatDate>{item.timestamp}</FormatDate>
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};
