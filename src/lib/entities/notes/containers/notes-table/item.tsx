import { FC } from 'react';
import Link from 'next/link';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

import { useNoteDotMenu } from '@/lib/entities/notes/containers/notes-table/dot-menu';
import type { Note } from '@/lib/entities/notes/schema';
import * as fromUrl from '@/lib/url/generator';
import { DropdownButton } from '@/components/ui/ionic/dropdown';

interface NoteItemProps {
  note: Note;
}

export const NoteItem: FC<NoteItemProps> = ({ note }) => {
  const options = useNoteDotMenu(note);

  return (
    <Link href={fromUrl.toNoteDetails(note.id)}>
      <IonItem detail button key={note.id}>
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
    </Link>
  );
};
