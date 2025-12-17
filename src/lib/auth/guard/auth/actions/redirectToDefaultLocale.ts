import { redirect } from 'next/navigation';

import { defaultLocale } from '@/config/languages';
import { createClient } from '@/lib/supabase/server';

export async function redirectToDefaultLocale() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, redirect to default locale
  if (!user) {
    redirect(`/${defaultLocale}`);
  }

  const { data } = await supabase
    .from('profiles')
    .select(`language`)
    .eq('id', user.id)
    .single();

  // Use user's language if available, otherwise use default locale
  const locale = data?.language || defaultLocale;
  redirect(`/${locale}`);
}
