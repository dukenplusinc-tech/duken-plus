import { FC, ReactNode } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

import { useNoteDotMenu } from '@/lib/entities/notes/containers/notes-table/dot-menu';
import type { Note } from '@/lib/entities/notes/schema';
import { DropdownButton } from '@/components/ui/ionic/dropdown';

interface NoteItemProps {
  note: Note;
  actionsButton?: ReactNode; // Allows passing a dropdown or custom actions button
}

export const NoteItem: FC<NoteItemProps> = ({ note, actionsButton }) => {
  const options = useNoteDotMenu(note);

  return (
    <IonItem key={note.id}>
      <IonLabel>{note.title || '---'}</IonLabel>
      <DropdownButton
        button={
          <IonButton fill="clear">
            <IonIcon slot="icon-only" icon={ellipsisVertical} />
          </IonButton>
        }
        options={options}
      />
    </IonItem>
  );
};
