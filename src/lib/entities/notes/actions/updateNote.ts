'use server';

import { NotePayload } from '@/lib/entities/notes/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateNote(
  id: string,
  payload: NotePayload
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from('notes').update(payload).eq('id', id);

  if (error) {
    throw error;
  }
}
