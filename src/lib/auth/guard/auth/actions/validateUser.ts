import { redirect } from 'next/navigation';

import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { checkSubscription } from '@/lib/entities/subscription/actions';
import { createClient } from '@/lib/supabase/server';
import * as fromUrl from '@/lib/url/generator';

export async function redirectIfGuest() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect(fromUrl.toSignIn());
  }
}

export async function validateUser() {
  let shopId = '';

  try {
    shopId = await getShopId();
  } catch {}

  if (!shopId) {
    redirect(fromUrl.toSignIn());
  }

  if (!(await checkSubscription(shopId))) {
    redirect(fromUrl.toSubscription());
  }
}
