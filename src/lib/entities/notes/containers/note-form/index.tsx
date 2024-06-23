'use client';

import * as React from 'react';
import { useCallback } from 'react';

import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';

import { NoteForm } from './form';

export const useNoteFormLaunch = (id?: string) => {
  const dialog = useModalDialog();

  return useCallback(() => {
    dialog.launch({
      render: <NoteForm id={id} />,
      title: id ? 'Edit Note' : 'Create Note',
      dialogClassName: 'sm:max-w-[600px]',
    });
  }, [dialog, id]);
};

export function NoteFormDialog() {
  const onOpen = useNoteFormLaunch();

  return <Button onClick={onOpen}>Add new</Button>;
}
