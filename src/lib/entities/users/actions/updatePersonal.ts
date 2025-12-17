'use server';

import { PersonalPayload } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function updatePersonal(
  id: string,
  payload: PersonalPayload
): Promise<void> {
  const supabase = await createClient();

  const { full_name, email, phone, language } = payload;

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, language, phone })
    .eq('id', id);

  if (error) {
    throw error;
  }

  const { error: userError } = await supabase.auth.updateUser({
    email,
  });

  if (userError) {
    throw userError;
  }
}
