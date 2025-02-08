'use server';

import { isFuture } from 'date-fns';

import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

interface Params {
  session_token: string;
}

export async function isValidToken({ session_token }: Params) {
  // Initialize the Supabase client using cookies from the request context.
  const supabase = createClient();

  // Get the currently authenticated admin user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Unauthorized: user not found');
  }

  const shopId = await getShopId();

  const { data: session } = await supabase
    .from('employee_sessions')
    .select(`id, expires_at, employee_id`)
    .eq('session_token', session_token)
    .eq('shop_id', shopId)
    .eq('admin_id', user.id)
    .maybeSingle();

  if (!session) {
    throw new Error('Failed to find employee');
  }

  if (!isFuture(new Date(session.expires_at))) {
    await supabase
      .from('employee_sessions')
      .delete()
      .eq('id', session.id)
      .single();

    throw new Error('Session expired');
  }

  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('id', session.employee_id)
    .single();

  if (!data) {
    return false;
  }

  return {
    full_name: data.full_name,
    sessionToken: session_token,
  };
}
