import type { ReactNode } from 'react';

import type { SortButtonProps } from '@/lib/composite/filters/ui/sort-button';

export interface SearchBarProps extends SortButtonProps {
  placeholder?: string;
  searchByField?: string;
  digitsSearchByField?: string;
  shop?: boolean;
  right?: ReactNode;
}
