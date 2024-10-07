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

import { useDeleteUser } from '@/lib/entities/users/hooks/useDeleteUser';
import type { User } from '@/lib/entities/users/schema';
import * as fromUrl from '@/lib/url/generator';
import {
  DropdownButton,
  DropDownButtonOption,
} from '@/components/ui/ionic/dropdown';
import { FormatDate } from '@/components/date/format-date';

interface UserItemProps {
  user: User;
}

function useDotMenu(id: string): DropDownButtonOption[] {
  const t = useTranslations('datatable.actions');

  const handleRemove = useDeleteUser(id);
  const router = useRouter();

  return useMemo(
    () => [
      {
        label: t('view_cation'),
        onClick: () => router.push(fromUrl.toUser(id)), // Adjust for User view
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

export const UserItem: FC<UserItemProps> = ({ user }) => {
  const options = useDotMenu(user.id);

  return (
    <Link href={fromUrl.toUser(user.id)}>
      <IonItem button lines="full">
        <IonAvatar aria-hidden="true" slot="start">
          <Image
            width={40}
            height={40}
            alt=""
            src="/placeholders/img/avatar.svg"
          />
        </IonAvatar>
        {/* Full Name and Role */}
        <IonLabel>
          <h2>{user.full_name || '---'}</h2>
          <p>{user.role?.name || 'No role assigned'}</p>

          {/* Timestamps: Created and Updated */}
          <IonNote slot="end" className="ion-text-end">
            <p>
              Created: <FormatDate>{user.created_at}</FormatDate>
            </p>
            <p>
              Updated: <FormatDate>{user.updated_at}</FormatDate>
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
