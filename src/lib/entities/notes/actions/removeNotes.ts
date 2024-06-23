'use server';

import { createClient } from '@/lib/supabase/server';

export async function removeNotes(uid: string | string[]) {
  const ids = Array.isArray(uid) ? uid : [uid];

  const supabase = createClient();

  await supabase.from('notes').delete().in('id', ids);

  return true;
}
