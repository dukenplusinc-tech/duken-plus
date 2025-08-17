'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/types';

declare global {
  // eslint-disable-next-line no-var
  var __supabaseBrowser__: SupabaseClient<Database> | undefined;
}

export function createClient(): SupabaseClient<Database> {
  if (!globalThis.__supabaseBrowser__) {
    globalThis.__supabaseBrowser__ = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return globalThis.__supabaseBrowser__;
}
