import type { Metadata } from 'next';

import { NoteEdit } from '@/lib/entities/notes/containers/note-edit';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Manage your note',
};

export default async function NotesPage({
  params,
}: {
  params: Record<'id' | 'locale', string>;
}) {
  return <NoteEdit id={params.id} />;
}
