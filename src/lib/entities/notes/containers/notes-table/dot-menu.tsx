import { FC } from 'react';
import { IonItem, IonList } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useNoteFormLaunch } from '@/lib/entities/notes/containers/note-form';
import { useDeleteNotes } from '@/lib/entities/notes/hooks/useDeleteNotes';
import { Note } from '@/lib/entities/notes/schema';

export const NoteDotMenu: FC<{ note: Note }> = ({ note }) => {
  const t = useTranslations('datatable.actions');

  const handleOpen = useNoteFormLaunch(note.id);
  const handleRemove = useDeleteNotes(note.id);

  return (
    <IonList>
      <IonItem button onClick={handleOpen}>
        {t('view_cation')}
      </IonItem>
      <IonItem
        button
        onClick={handleRemove.onDelete}
        disabled={handleRemove.processing}
      >
        {t('delete_cation')}
      </IonItem>
    </IonList>
  );
};
