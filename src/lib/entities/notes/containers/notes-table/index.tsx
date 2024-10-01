'use client';

import { FC } from 'react';
import Link from 'next/link';
import { IonButton, IonIcon, IonList, IonSpinner } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { NoteItem } from '@/lib/entities/notes/containers/notes-table/item';
import { useNotes } from '@/lib/entities/notes/hooks/useNotes';
import * as fromUrl from '@/lib/url/generator';
import { PageHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';

export const NotesTable: FC = () => {
  const t = useTranslations('notes');

  const { data, isLoading } = useNotes();

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        right={
          <Link href={fromUrl.toAddNote()}>
            <IonButton color="success">
              <IonIcon
                slot="icon-only"
                size="large"
                className="text-white"
                icon={add}
              />
            </IonButton>
          </Link>
        }
      >
        {t('title')}
      </PageHeader>

      {!isLoading && !data.length && (
        <EmptyScreen>{t('empty_text')}</EmptyScreen>
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
