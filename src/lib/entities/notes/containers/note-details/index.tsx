'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IonButton } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useDeleteNotes } from '@/lib/entities/notes/hooks/useDeleteNotes';
import { useNoteById } from '@/lib/entities/notes/hooks/useNoteById';
import * as fromUrl from '@/lib/url/generator';
import { DropdownButton } from '@/components/ui/ionic/dropdown';
import { EntityLoader } from '@/components/ui/loader';
import { PageHeader } from '@/components/ui/page/header';

export const NoteDetails: FC<{ id: string }> = ({ id }) => {
  const router = useRouter();

  const t = useTranslations();

  const note = useNoteById(id);
  const handleRemove = useDeleteNotes(id, fromUrl.toNotes());

  const options = useMemo(
    () => [
      {
        label: t('datatable.actions.view_cation'),
        onClick: () => router.push(fromUrl.toNoteEdit(id)),
      },
      {
        label: t('datatable.actions.delete_cation'),
        onClick: handleRemove.onDelete,
        disabled: handleRemove.processing,
      },
    ],
    [t, router, id, handleRemove]
  );

  return (
    <EntityLoader
      canDismiss
      dismissURL={fromUrl.toNotes()}
      loading={note.isLoading}
      error={note.error}
    >
      {note.data && (
        <>
          <PageHeader right={<DropdownButton options={options} />}>
            {note.data?.title}
          </PageHeader>

          <div className="p-10 min-h-52">{note?.data?.content}</div>
          <div className="mt-2">
            <Link href={fromUrl.toNoteEdit(id)}>
              <IonButton expand="block" color="success" type="button">
                {t('notes.edit_btn')}
              </IonButton>
            </Link>
          </div>
        </>
      )}
    </EntityLoader>
  );
};
