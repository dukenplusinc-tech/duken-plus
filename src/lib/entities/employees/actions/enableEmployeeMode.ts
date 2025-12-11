'use server';

import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

interface EnableEmployeeModeParams {
  employeeId: string;
  pin: string;
}

export async function enableEmployeeMode({
  employeeId,
  pin,
}: EnableEmployeeModeParams) {
  // Initialize the Supabase client using cookies from the request context.
  const supabase = await createClient();

  // Get the currently authenticated admin user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Unauthorized: user not found');
  }

  const shopId = await getShopId();

  const { data: profile } = await supabase
    .from('employees')
    .select(`id, pin_code`)
    .eq('id', employeeId)
    .eq('shop_id', shopId)
    .maybeSingle();

  if (!profile) {
    throw new Error('Failed to find employee');
  }

  if (profile.pin_code !== pin) {
    throw new Error('Wrong PIN code');
  }

  // Generate a unique session token.
  const sessionToken = crypto.randomUUID();

  // Calculate the expiration time: 8 hours from now
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

  // Insert a new employee session row with `auth_id`
  const { data, error } = await supabase
    .from('employee_sessions')
    .insert({
      auth_id: user.id, // Store the current authenticated user's ID
      admin_id: user.id, // Keep this as the admin who initiated the session
      employee_id: employeeId,
      shop_id: shopId,
      expires_at: expiresAt,
      session_token: sessionToken,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return false;
  }

  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('admin_id', user.id)
    .single();

  // Return the newly created session row.
  return {
    ...data,
    full_name: employee?.full_name,
  };
}
