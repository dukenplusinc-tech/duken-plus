import type { Metadata } from 'next';

import { NoteCreate } from '@/lib/entities/notes/containers/note-create';

export const metadata: Metadata = {
  title: 'Add new Note',
  description: 'Manage your notes',
};

export default async function AddNotePage() {
  return <NoteCreate />;
}
