'use client';

import type { FC } from 'react';
import { IonItem, IonLabel, IonList, IonSpinner } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useUserActionLogs } from '@/lib/entities/users/hooks/useUserActionLogs';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { FormatDate } from '@/components/date/format-date';

export const UserActionsLog: FC<{ id: string; full_name: string }> = ({
  id,
  full_name,
}) => {
  const t = useTranslations('user_logs');

  const { data, count, isLoading, error } = useUserActionLogs(id);

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
            <IonItem key={item.id}>
              <IonLabel>
                <div className="flex space-x-2">
                  <Badge>{item.action}</Badge>
                </div>
              </IonLabel>
              <IonLabel>
                <div className="flex space-x-2">
                  <span className="max-w-[250px] truncate font-medium">
                    {item.entity}
                  </span>
                </div>
              </IonLabel>
              <IonLabel>
                <div className="flex space-x-2">
                  <span className="max-w-[250px] truncate font-medium">
                    {item.entity_id}
                  </span>
                </div>
              </IonLabel>
              <IonLabel>
                <div className="flex space-x-2">
                  <FormatDate className="font-medium">
                    {item.timestamp}
                  </FormatDate>
                </div>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};
