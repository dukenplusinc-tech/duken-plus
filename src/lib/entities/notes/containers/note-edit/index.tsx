'use client';

import { FC, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { NoteForm } from '@/lib/entities/notes/containers/note-form/form';
import { useDeleteNotes } from '@/lib/entities/notes/hooks/useDeleteNotes';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import * as fromUrl from '@/lib/url/generator';
import { DropdownButton } from '@/components/ui/ionic/dropdown';
import { PageHeader } from '@/components/ui/page/header';

export const NoteEdit: FC<{ id: string }> = ({ id }) => {
  useActivateBackButton();

  const t = useTranslations('notes');

  const handleRemove = useDeleteNotes(id, fromUrl.toNotes());

  const options = useMemo(
    () => [
      {
        label: 'Delete',
        onClick: handleRemove.onDelete,
        disabled: handleRemove.processing,
      },
    ],
    [handleRemove]
  );

  return (
    <>
      <PageHeader right={<DropdownButton options={options} />}>
        {t('title_edit')}
      </PageHeader>

      <NoteForm id={id} />
    </>
  );
};
