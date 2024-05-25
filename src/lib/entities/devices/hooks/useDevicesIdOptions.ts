'use client';

import { useMemo } from 'react';

import { Device } from '@/lib/entities/devices/schema';
import { useQuery } from '@/lib/supabase/query';
import { FacedFilterOptions } from '@/components/filters/faceted-filter';

export const useDevicesIdOptions = (): FacedFilterOptions[] => {
  const { data } = useQuery<Pick<Device, 'id' | 'device_id' | 'os'>[]>(
    'devices',
    `
        id,
        device_id,
        os
      `,
    {
      allowedFilters: [],
      pagination: false,
    }
  );

  return useMemo(() => {
    return (data || []).map((device) => ({
      label: `${device.device_id} - ${device.os}`,
      value: `${device.device_id}`,
    }));
  }, [data]);
};
