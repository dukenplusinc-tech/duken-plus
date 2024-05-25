'use client';

import { Issue, issueSchema } from '@/lib/entities/issues/schema';
import { useQuery } from '@/lib/supabase/query';

export const useIssues = () => {
  return useQuery<Issue[]>(
    'issues',
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
        device:device_id( id, created_at, device_id, os )
      `,
    { schema: issueSchema }
  );
};
