'use server';

import { createClient } from '@/lib/supabase/server';

export async function isValidAdminPin(pin_code: string) {
  // Initialize the Supabase client using cookies from the request context.
  const supabase = await createClient();

  // Get the currently authenticated admin user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    throw new Error('Failed to find current user');
  }

  const { data: session } = await supabase
    .from('profiles')
    .select(`id, pin_code`)
    .eq('id', user.id)
    .maybeSingle();

  if (!session) {
    throw new Error('Failed to find profile');
  }

  return session.pin_code === pin_code;
}
