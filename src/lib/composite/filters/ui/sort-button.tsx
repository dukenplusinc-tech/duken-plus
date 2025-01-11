import { FC, useEffect, useState } from 'react';
import { SortAscIcon, SortDescIcon } from 'lucide-react';

import { useFiltersCtx } from '@/lib/composite/filters/context';
import { Button } from '@/components/ui/button';
import {
  DropdownButton,
  DropDownButtonOption,
} from '@/components/ui/ionic/dropdown';

export interface SortButtonProps {
  sortByOptions?: { label: string; value: string }[]; // List of fields to sort by
  defaultSortBy?: string; // Default field to sort
  sortBy?: string; // Single field to sort by (used in single-field mode)
}

export const SortButton: FC<SortButtonProps> = ({
  sortByOptions = [],
  defaultSortBy = 'created_at',
  sortBy,
}) => {
  const { setSorting } = useFiltersCtx();
  const [sortField, setSortField] = useState<string>(sortBy || defaultSortBy);
  const [desc, setDesc] = useState<boolean>(true);

  // Update sorting when sort field or direction changes
  useEffect(() => {
    setSorting([
      {
        id: sortField,
        desc,
      },
    ]);
  }, [setSorting, sortField, desc]);

  // Build dropdown options for multiple-field mode
  const dropdownOptions: DropDownButtonOption[] = (sortByOptions || []).map(
    (option) => ({
      label: (
        <div className="flex items-center justify-between">
          <span>{option.label}</span>
          {sortField === option.value ? (
            desc ? (
              <SortDescIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <SortAscIcon className="h-4 w-4 text-gray-500" />
            )
          ) : null}
        </div>
      ),
      onClick: () => {
        if (sortField === option.value) {
          // Toggle direction if the same field is clicked
          setDesc((prev) => !prev);
        } else {
          // Change field and reset to descending by default
          setSortField(option.value);
          setDesc(true);
        }
      },
    })
  );

  // Determine if single-field mode or multiple-field mode
  const isSingleField = !sortByOptions || sortByOptions.length <= 1;

  return (
    <div>
      {isSingleField ? (
        // Single-field mode: No dropdown, only toggle direction
        <Button
          variant="default"
          size="icon"
          className="bg-primary hover:bg-primary/90 h-[38px] w-[38px]"
          onClick={() => setDesc((prev) => !prev)}
        >
          {desc ? (
            <SortDescIcon className="h-5 w-5" />
          ) : (
            <SortAscIcon className="h-5 w-5" />
          )}
        </Button>
      ) : (
        // Multiple-field mode: Dropdown for field selection and direction toggle
        <DropdownButton
          options={dropdownOptions}
          button={
            <Button
              variant="default"
              size="icon"
              className="w-auto h-[38px] px-2 bg-primary hover:bg-primary/90"
            >
              <span>
                {sortByOptions.find((opt) => opt.value === sortField)?.label ||
                  'Sort'}
              </span>
              {desc ? (
                <SortDescIcon className="h-5 w-5 ml-2" />
              ) : (
                <SortAscIcon className="h-5 w-5 ml-2" />
              )}
            </Button>
          }
        />
      )}
    </div>
  );
};
