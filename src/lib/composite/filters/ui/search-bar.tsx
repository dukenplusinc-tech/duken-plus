import { FC } from 'react';

import { SearchInput } from '@/lib/composite/filters/ui/search-input';
import { ShopButton } from '@/lib/composite/filters/ui/shop-button';
import { SortButton } from '@/lib/composite/filters/ui/sort-button';
import type { SearchBarProps } from '@/lib/composite/filters/ui/types';

export const SearchBar: FC<SearchBarProps> = ({
  placeholder,
  searchByField = 'title',
  digitsSearchByField,
  sortBy = 'created_at',
  sortByOptions,
  defaultSortBy,
  shop = false,
  right,
}) => {
  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2">
        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            placeholder={placeholder}
            searchBy={searchByField}
            digitsSearchByField={digitsSearchByField}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 sm:justify-start sm:w-auto">
          {shop && <ShopButton />}
          {right}
          <SortButton
            sortBy={sortBy}
            sortByOptions={sortByOptions}
            defaultSortBy={defaultSortBy}
          />
        </div>
      </div>
    </div>
  );
};
