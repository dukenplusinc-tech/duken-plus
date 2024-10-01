import { FC } from 'react';
import Link from 'next/link';
import { IonItem, IonList } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useDeleteNotes } from '@/lib/entities/notes/hooks/useDeleteNotes';
import type { Note } from '@/lib/entities/notes/schema';
import * as fromUrl from '@/lib/url/generator';

export const NoteDotMenu: FC<{ note: Note }> = ({ note }) => {
  const t = useTranslations('datatable.actions');

  const handleRemove = useDeleteNotes(note.id);

  return (
    <IonList>
      <Link href={fromUrl.toNoteEdit(note.id)}>
        <IonItem button>{t('view_cation')}</IonItem>
      </Link>
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
