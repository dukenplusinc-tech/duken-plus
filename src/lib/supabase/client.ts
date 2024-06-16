import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/lib/supabase/types';

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

if (typeof window !== 'undefined') {
  (window as any).bpShop = {
    supabase: createClient(),
  };
}

export type Builder = PostgrestFilterBuilder<any, any, any>;
