import type { Metadata } from 'next';

import { NoteEdit } from '@/lib/entities/notes/containers/note-edit';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Manage your note',
};

export default async function NotesPage({
  params,
}: {
  params: Promise<Record<'id' | 'locale', string>>;
}) {
  const { id } = await params;
  return <NoteEdit id={id} />;
}
