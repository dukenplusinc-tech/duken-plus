'use client';

import { FC } from 'react';
import { IonButton, IonIcon, IonList, IonSpinner } from '@ionic/react';
import { add } from 'ionicons/icons';

import { NoteItem } from '@/lib/entities/notes/containers/notes-table/item';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';

export const NotesTable: FC = () => {
  const { data, isLoading } = useNotes();

  return (
    <div className="flex flex-col h-full">
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

      {!isLoading && !data.length && (
        <EmptyScreen>
          No Notes available. Press the + to add something
        </EmptyScreen>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IonSpinner name="dots" />
        </div>
      ) : (
        <IonList>
          {data.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </IonList>
      )}
    </div>
  );
};
