import { z } from 'zod';

import { ActiveFilter } from '@/lib/composite/filters/context';
import { issueSchema } from '@/lib/entities/issues/schema';
import { createClient } from '@/lib/supabase/client';
import { withFilters } from '@/lib/supabase/filters';

export async function getIssues({ filters }: { filters: ActiveFilter[] }) {
  const supabase = createClient();

  const query = supabase.from('issues').select(
    `
    id,
    created_at,
    title,
    stack,
    properties,
    ip,
    country,
    url,
    dashboard,
    device:device_id ( id, created_at, device_id, os )
  `,
    { count: 'exact' }
  );

  const { data } = await withFilters(query, filters);

  return z.array(issueSchema).parse(data || []);
}
