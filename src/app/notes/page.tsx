import type { Metadata } from 'next';

import { NoteFormDialog } from '@/lib/entities/notes/containers/note-form';
import { NotesTable } from '@/lib/entities/notes/containers/notes-table';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Manage your notes',
};

export default async function NotesPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground">
            Manage your notes and view details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <NoteFormDialog />
        </div>
      </div>
      <NotesTable />
    </div>
  );
}
