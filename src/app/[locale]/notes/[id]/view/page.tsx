import type { Metadata } from 'next';

import { NoteDetails } from '@/lib/entities/notes/containers/note-details';

export const metadata: Metadata = {
  title: 'Note',
  description: 'Note details',
};

export default async function NotesPage({
  params,
}: {
  params: Promise<Record<'id' | 'locale', string>>;
}) {
  const { id } = await params;
  return <NoteDetails id={id} />;
}
