import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/types';

declare global {
  // avoid re-creation during dev HMR
  // eslint-disable-next-line no-var
  // noinspection JSUnusedGlobalSymbols
  var __supabaseServer__: SupabaseClient<Database> | undefined;
}

export function createClient(): SupabaseClient<Database> {
  if (!global.__supabaseServer__) {
    global.__supabaseServer__ = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!, // server-only secret
      {
        cookies: {
          get(name: string) {
            // gets the store for the *current* request
            return cookies().get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookies().set({ name, value, ...options });
            } catch {
              // called from a Server Component (no mutable cookies) — ignore
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookies().set({ name, value: '', ...options });
            } catch {
              // called from a Server Component — ignore
            }
          },
        },
      }
    );
  }
  return global.__supabaseServer__;
}
