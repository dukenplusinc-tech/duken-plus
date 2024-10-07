'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { NoteForm } from '@/lib/entities/notes/containers/note-form/form';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { PageHeader } from '@/components/ui/page/header';

export const NoteCreate: FC = () => {
  useActivateBackButton();

  const t = useTranslations('notes');

  return (
    <>
      <PageHeader>{t('title_add')}</PageHeader>

      <NoteForm />
    </>
  );
};
