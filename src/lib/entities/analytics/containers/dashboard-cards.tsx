'use client';

import { FC, ReactNode } from 'react';
import { CardStackIcon, DesktopIcon } from '@radix-ui/react-icons';
import type { PostgrestError } from '@supabase/supabase-js';

import { useActiveDevicesAmount } from '@/lib/entities/issues/hooks/useActiveDevicesAmount';
import { useActiveIssuesAmount } from '@/lib/entities/issues/hooks/useActiveIssuesAmount';
import { useTotalDevicesAmount } from '@/lib/entities/issues/hooks/useTotalDevicesAmount';
import { useTotalIssuesAmount } from '@/lib/entities/issues/hooks/useTotalIssuesAmount';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmallSpinner } from '@/components/spinner/small';

const icons = {
  issues: <CardStackIcon />,
  devices: <DesktopIcon />,
  activeIssues: <CardStackIcon />,
  activeDevices: <DesktopIcon />,
};

const CardItem: FC<{
  isLoading?: boolean;
  error?: PostgrestError;
  amount?: string | number | null;
  title?: string;
  description?: string;
  icon?: ReactNode;
}> = ({ amount, isLoading, error, title, description, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <SmallSpinner className="mb-2 mt-2" />
        ) : error ? (
          'Failed to load...'
        ) : (
          amount
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function AnalyticsDashboardCards() {
  const totalIssues = useTotalIssuesAmount();
  const totalDevicesAmount = useTotalDevicesAmount();
  const activeIssues = useActiveIssuesAmount();
  const activeDevices = useActiveDevicesAmount();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardItem
        title="Total Issues"
        description="in range"
        icon={icons.issues}
        amount={totalIssues.count}
        isLoading={totalIssues.isLoading}
        error={totalIssues.error}
      />
      <CardItem
        title="Total Devices"
        description="in range"
        icon={icons.devices}
        amount={totalDevicesAmount.count}
        isLoading={totalDevicesAmount.isLoading}
        error={totalDevicesAmount.error}
      />

      <CardItem
        title="Active Devices"
        description="since last hour"
        icon={icons.activeDevices}
        amount={activeDevices.count}
        isLoading={activeDevices.isLoading}
        error={activeDevices.error}
      />

      <CardItem
        title="Active Issues"
        description="since last hour"
        icon={icons.activeIssues}
        amount={activeIssues.count}
        isLoading={activeIssues.isLoading}
        error={activeIssues.error}
      />
    </div>
  );
}
