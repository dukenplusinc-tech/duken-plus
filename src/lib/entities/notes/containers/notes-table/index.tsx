'use client';

import { FC, MouseEvent, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonList,
  IonPopover,
  IonSpinner,
} from '@ionic/react';
import { add } from 'ionicons/icons';

import { NoteDotMenu } from '@/lib/entities/notes/containers/notes-table/dot-menu';
import { NoteItem } from '@/lib/entities/notes/containers/notes-table/item';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import type { Note } from '@/lib/entities/notes/schema';
import { PageHeader } from '@/components/ui/page/header';

export const NotesTable: FC = () => {
  const { data, isLoading } = useNotes();

  const [showPopover, setShowPopover] = useState({
    isOpen: false,
    event: null as Event | null,
    note: null as Note | null,
  });

  const handleShowPopover =
    (note: Note) => (event: MouseEvent<HTMLIonButtonElement>) => {
      setShowPopover({
        isOpen: true,
        event: event.nativeEvent,
        note,
      });
    };

  const closePopover = () => {
    setShowPopover({
      isOpen: false,
      event: null,
      note: null,
    });
  };

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
        <IonList>
          {data.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onActions={handleShowPopover(note)}
            />
          ))}
        </IonList>
      )}

      {/* Popover for Edit and Delete */}
      <IonPopover
        isOpen={showPopover.isOpen}
        event={showPopover.event}
        onDidDismiss={closePopover}
      >
        <div
          onClickCapture={() => {
            requestIdleCallback(closePopover);
          }}
        >
          {showPopover.note && <NoteDotMenu note={showPopover.note} />}
        </div>
      </IonPopover>
    </>
  );
};
