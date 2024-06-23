import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/types';

export const createCliClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
};
