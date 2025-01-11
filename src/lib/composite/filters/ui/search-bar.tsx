import { FC } from 'react';

import { SearchInput } from '@/lib/composite/filters/ui/search-input';
import { ShopButton } from '@/lib/composite/filters/ui/shop-button';
import { SortButton } from '@/lib/composite/filters/ui/sort-button';
import { SearchBarProps } from '@/lib/composite/filters/ui/types';

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
      <div className="flex gap-2">
        <SearchInput
          placeholder={placeholder}
          searchBy={searchByField}
          digitsSearchByField={digitsSearchByField}
        />
        {shop && <ShopButton />}
        {right}
        <SortButton
          sortBy={sortBy}
          sortByOptions={sortByOptions}
          defaultSortBy={defaultSortBy}
        />
      </div>
    </div>
  );
};
