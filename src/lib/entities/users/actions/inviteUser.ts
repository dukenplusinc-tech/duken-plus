'use server';

import { InviteUser } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';
import { defaultLocale } from '@/config/languages';

export async function inviteUser(
  values: InviteUser,
  redirectTo: string,
  locale?: string
) {
  const supabase = await createClient();

  // Get inviter's language preference from their profile, or use provided locale, or default to Russian
  let userLanguage = locale || defaultLocale;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('language')
      .eq('id', user.id)
      .single();
    
    if (profile?.language) {
      userLanguage = profile.language;
    }
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    values.email,
    {
      redirectTo,
      data: {
        language: userLanguage,
      },
    }
  );

  if (error) {
    throw error;
  }

  const profileResponse = await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: values.full_name,
    role_id: Number(values.role_id),
  });

  if (profileResponse.error) {
    throw profileResponse.error;
  }

  return true;
}
