import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function redirectToDefaultLocale() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('profiles')
    .select(`language`)
    .eq('id', user?.id!)
    .single();

  redirect(data?.language ? `/${data?.language}` : '/');
}
