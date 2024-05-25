import { FC } from 'react';

import { useDevicesIdOptions } from '@/lib/entities/devices/hooks/useDevicesIdOptions';
import { FacetedFilter } from '@/components/filters/faceted-filter';

export const IssuesFilterByDeviceId: FC = () => {
  const options = useDevicesIdOptions();

  return (
    <FacetedFilter
      title="Device ID"
      filterKey="device.device_id"
      options={options}
    />
  );
};
