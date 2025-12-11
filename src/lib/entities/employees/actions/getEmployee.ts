'use server';

import { createClient } from '@/lib/supabase/server';

export async function getEmployee(id: string) {
  const supabase = await createClient();

  const profile = await supabase
    .from('employees')
    .select(
      `
      full_name
`
    )
    .eq('id', id)
    .single();

  return profile?.data;
}
