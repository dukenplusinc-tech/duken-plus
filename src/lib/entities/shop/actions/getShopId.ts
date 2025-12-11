'use server';

import { createClient } from '@/lib/supabase/server';

export async function getShopId(): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error('Cannot get User ID');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user?.id!)
    .single();

  if (!profile?.shop_id) {
    throw new Error('Unable to find Shop ID');
  }

  return profile.shop_id;
}
