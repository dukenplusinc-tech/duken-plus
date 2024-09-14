import type { Metadata } from 'next';

import { NotesTable } from '@/lib/entities/notes/containers/notes-table';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Manage your notes',
};

export default async function NotesPage() {
  return <NotesTable />;
}
