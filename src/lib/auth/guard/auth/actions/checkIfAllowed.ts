import { RoleScope } from '@/lib/entities/roles/types';
import { User } from '@/lib/entities/users/schema';
import { createClient } from '@/lib/supabase/server';

export async function checkIfAllowed(allowed: RoleScope | string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data?.user) {
    return false;
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
    return false;
  }

  const { scope } = (profile as never as User).role;

  return scope.includes(allowed);
}
