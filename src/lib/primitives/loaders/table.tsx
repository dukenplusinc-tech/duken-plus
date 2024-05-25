import type { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export const TableLoaderSkeleton: FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[60px] rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
    </div>
  );
};
