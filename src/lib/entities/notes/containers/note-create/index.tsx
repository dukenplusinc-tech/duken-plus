'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { NoteForm } from '@/lib/entities/notes/containers/note-form/form';
import { PageHeader } from '@/components/ui/page/header';

export const NoteCreate: FC = () => {
  const t = useTranslations('notes');

  return (
    <>
      <PageHeader>{t('title_add')}</PageHeader>

      <NoteForm />
    </>
  );
};
