'use client';

import {
  NotePayload,
  notePayloadSchema as schema,
} from '@/lib/entities/notes/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useNoteById = (id: string | null = null) => {
  return useQueryById<NotePayload>(
    id,
    'notes',
    `
        title,
        content
      `,
    {
      schema,
    }
  );
};
