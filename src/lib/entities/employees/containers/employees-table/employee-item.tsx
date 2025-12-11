import { FC, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import type { Employee } from '@/lib/entities/employees/schema';
import { useDeleteEmployee } from '@/lib/entities/employees/hooks/useDeleteEmployee';
import * as fromUrl from '@/lib/url/generator';
import {
  DropdownButton,
  DropDownButtonOption,
} from '@/components/ui/ionic/dropdown';
import { FormatDate } from '@/components/date/format-date';

interface EmployeeItemProps {
  employee: Employee;
}

function useDotMenu(id: string): DropDownButtonOption[] {
  const t = useTranslations('datatable.actions');

  const handleRemove = useDeleteEmployee(id);
  const router = useRouter();

  return useMemo(
    () => [
      {
        label: t('view_cation'),
        onClick: () => router.push(fromUrl.toEmployeeLogs(id)),
      },
      {
        label: t('edit_caption'),
        onClick: () => router.push(fromUrl.toEmployeeEdit(id)),
      },
      {
        label: t('delete_cation'),
        onClick: handleRemove.onDelete,
        disabled: handleRemove.processing,
      },
    ],
    [handleRemove.onDelete, handleRemove.processing, id, router, t]
  );
}

export const EmployeeItem: FC<EmployeeItemProps> = ({ employee }) => {
  const options = useDotMenu(employee.id);

  return (
    <Link href={fromUrl.toEmployeeLogs(employee.id)}>
      <IonItem button lines="full">
        <IonAvatar aria-hidden="true" slot="start">
          <Image
            width={40}
            height={40}
            alt=""
            src="/placeholders/img/avatar.svg"
          />
        </IonAvatar>
        <IonLabel>
          <h2>{employee.full_name || '---'}</h2>
          <IonNote slot="end" className="ion-text-end">
            <p>
              Created: <FormatDate>{employee.created_at}</FormatDate>
            </p>
            <p>
              Updated: <FormatDate>{employee.updated_at}</FormatDate>
            </p>
          </IonNote>
        </IonLabel>

        {/* Dropdown Button for Actions */}
        <DropdownButton
          button={
            <IonButton fill="clear">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
          }
          options={options}
        />
      </IonItem>
    </Link>
  );
};
