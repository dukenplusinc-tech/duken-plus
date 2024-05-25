'use client';

import { useMemo } from 'react';
import { z } from 'zod';

import { Device, deviceSchema as schema } from '@/lib/entities/devices/schema';
import { useQuery } from '@/lib/supabase/query';

interface AggregatedDevice extends Device {
  issues: { count: number }[];
}

export const useDevices = () => {
  const { data: response, ...rest } = useQuery<AggregatedDevice[]>(
    'devices',
    `
        id,
        created_at,
        device_id,
        os,
        issues(count)
      `
  );

  return useMemo(() => {
    const data: Device[] = Array.isArray(response)
      ? response.map(({ issues, ...device }) => ({
          ...device,
          issuesCount: issues[0]?.count || 0,
        }))
      : [];

    return {
      ...rest,
      data: z.array(schema).parse(data),
    };
  }, [response, rest]);
};
