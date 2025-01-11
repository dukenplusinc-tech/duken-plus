'use client';

import { Note } from '@/lib/entities/notes/schema';
import { useInfiniteQuery } from '@/lib/supabase/useInfiniteQuery';

export const useNotes = () => {
  return useInfiniteQuery<Note>({
    table: 'notes',
    columns: `id,
        title,
        content,
        created_at,
        updated_at
      `,
  });
};
