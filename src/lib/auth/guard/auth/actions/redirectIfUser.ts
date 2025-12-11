import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function redirectIfUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (data?.user) {
    redirect('/');
  }
}
