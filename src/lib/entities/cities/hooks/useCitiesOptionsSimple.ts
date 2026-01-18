'use client';

import { useMemo } from 'react';
import { useQuery as useQuerySwr } from '@supabase-cache-helpers/postgrest-swr';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  id: z.string(),
  value: z.string(),
  label: z.string(),
  group: z.string().optional(),
});

type Option = z.infer<typeof schema>;

type GroupedOption = {
  group: string;
  list: Option[];
};

export const useCitiesOptionsSimple = (): GroupedOption[] => {
  const client = createClient();

  const query = useMemo(() => {
    return client
      .from('cities')
      .select('id, title, region')
      .order('title', { ascending: true });
  }, [client]);

  const { data, error } = useQuerySwr(query as any);

  return useMemo(() => {
    if (error) {
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    if (data.length === 0) {
      console.warn('Cities query returned empty array');
      return [];
    }

    try {
      const mapped = data.map((city: any) => ({
        id: String(city.id || city.external_id || `city-${city.title}-${city.region}`),
        value: city.title,
        label: city.title,
        group: city.region || 'Other',
      }));

      // Validate with schema (id is required for unique keys)
      const parsed = z.array(schema).parse(mapped);

      // Sort by region first, then by title
      const sorted = [...parsed].sort((a, b) => {
        const groupA = a.group || 'Other';
        const groupB = b.group || 'Other';
        if (groupA !== groupB) {
          return groupA.localeCompare(groupB);
        }
        return a.label.localeCompare(b.label);
      });

      const grouped = sorted.reduce((result, currentValue) => {
        const groupName = currentValue.group || 'Other';
        const group = result.find((item) => item.group === groupName);

        if (group) {
          group.list.push(currentValue);
        } else {
          result.push({
            group: groupName,
            list: [currentValue],
          });
        }

      return result;
    }, [] as GroupedOption[]);

    return grouped;
  } catch (parseError) {
    return [];
  }
  }, [data, error]);
};
