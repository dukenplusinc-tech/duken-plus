import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import * as fromUrl from '@/lib/url/generator';

export async function redirectIfUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (data?.user) {
    // Check if user has a shopId before redirecting
    // If no shopId, redirect to init instead of home to avoid redirect loop
    try {
      await getShopId();
      // User has shopId, redirect to home
      redirect('/');
    } catch {
      // User doesn't have shopId, redirect to init for setup
      redirect(fromUrl.toInit());
    }
  }
}
