import { redirect } from 'next/navigation';

import { User } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function redirectIfNotAllowed(allowed: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      `
        role:role_id (
          id,
          name:role,
          scope
        )
        `
    )
    .eq('id', data.user.id)
    .single();

  if (!profile?.role) {
    redirect('/');
  }

  const { scope } = (profile as never as User).role;

  const granted = scope.includes(allowed);

  if (!granted) {
    redirect('/');
  }
}
