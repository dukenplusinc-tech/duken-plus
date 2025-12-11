'use server';

import { NotePayload } from '@/lib/entities/notes/schema';
import { createClient } from '@/lib/supabase/server';

export async function createNote(payload: NotePayload): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('notes').insert(payload);

  if (error) {
    throw error;
  }
}
