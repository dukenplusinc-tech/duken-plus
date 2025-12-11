'use server';

import { createClient } from '@/lib/supabase/server';

export async function getProfile(id: string) {
  const supabase = await createClient();

  const profile = await supabase
    .from('profiles')
    .select(
      `
      full_name,
      role:role_id (
          id,
          name:role,
          scope
        )`
    )
    .eq('id', id)
    .single();

  return profile?.data;
}
