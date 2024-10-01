'use client';

import { FC } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { add } from 'ionicons/icons';

import { NoteForm } from '@/lib/entities/notes/containers/note-form/form';
import { PageHeader } from '@/components/ui/page/header';

export const NoteEdit: FC<{ id: string }> = ({ id }) => {
  const isLoading = false;

  return (
    <>
      <PageHeader
        right={
          <IonButton color="success">
            <IonIcon
              slot="icon-only"
              size="large"
              className="text-white"
              icon={add}
            />
          </IonButton>
        }
      >
        Заметки
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IonSpinner name="dots" />
        </div>
      ) : (
        <NoteForm id={id} />
      )}
    </>
  );
};
