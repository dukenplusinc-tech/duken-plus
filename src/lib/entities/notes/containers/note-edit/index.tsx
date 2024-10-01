'use client';

import { FC } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

import { NoteForm } from '@/lib/entities/notes/containers/note-form/form';
import { PageHeader } from '@/components/ui/page/header';

export const NoteEdit: FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <PageHeader
        right={
          <IonButton color="success">
            <IonIcon
              slot="icon-only"
              size="large"
              className="text-white"
              icon={ellipsisVertical}
            />
          </IonButton>
        }
      >
        Заметки
      </PageHeader>

      <NoteForm id={id} />
    </>
  );
};
