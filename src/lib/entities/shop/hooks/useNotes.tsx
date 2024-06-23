'use client';

import { Note, noteSchema as schema } from '@/lib/entities/notes/schema';
import { useQuery } from '@/lib/supabase/query';

const sort = [
  {
    id: 'updated_at',
    desc: true,
  },
];

export const useNotes = () => {
  return useQuery<Note[]>(
    'notes',
    `
        id,
        title,
        content,
        created_at,
        updated_at
      `,
    {
      schema,
      sort,
    }
  );
};
