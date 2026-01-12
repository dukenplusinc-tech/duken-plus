'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { IonButton, IonIcon, IonList, IonSpinner } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { EmployeeItem } from '@/lib/entities/employees/containers/employees-table/employee-item';
import { useEmployees } from '@/lib/entities/employees/hooks/useEmployees';
import { usePageRefresh } from '@/lib/hooks/usePageRefresh';
import * as fromUrl from '@/lib/url/generator';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';

export const EmployeesTable: FC = () => {
  const t = useTranslations('employees');

  const { data, isLoading, sentinelRef, refresh } = useEmployees();
  usePageRefresh(refresh);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        right={
          <Link href={fromUrl.toEmployeeCreate()}>
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
          {data.map((employee) => (
            <EmployeeItem key={employee.id} employee={employee} />
          ))}
        </IonList>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};
