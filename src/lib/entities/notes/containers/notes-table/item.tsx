import { FC, MouseEventHandler } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

import type { Note } from '@/lib/entities/notes/schema';

export const NoteItem: FC<{
  note: Note;
  onActions?: MouseEventHandler<HTMLIonButtonElement>;
}> = ({ note, onActions }) => {
  return (
    <IonItem key={note.id}>
      <IonLabel>{note.title || '---'}</IonLabel>
      <IonButton fill="clear" onClick={onActions}>
        <IonIcon slot="icon-only" icon={ellipsisVertical} />
      </IonButton>
    </IonItem>
  );
};
