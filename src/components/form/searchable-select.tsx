'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Define the option type
type Option = {
  value: string;
  label: string;
};

// Define the component props
interface CombinedSearchableSelectProps {
  options: Option[];
  placeholder?: string;
  label?: string;
  className?: string;
  onChange?: (value: { selected: string | null; inputValue: string }) => void;
  defaultValue?: string;
}

export function CombinedSearchableSelect({
  options,
  placeholder = 'Search or enter custom value',
  label = 'Select or enter value',
  className,
  onChange,
  defaultValue = '',
}: CombinedSearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(defaultValue);
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(
    options.find(
      (option) => option.value === defaultValue || option.label === defaultValue
    ) || null
  );

  // Handle selection change
  const handleSelect = (value: string) => {
    const option = options.find((option) => option.value === value);
    setSelectedOption(option || null);
    setInputValue(option?.label || '');
    onChange?.({
      selected: option?.value || null,
      inputValue: option?.label || '',
    });
    setOpen(false);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);

    // If input exactly matches an option, set it as selected
    const matchedOption = options.find(
      (option) => option.label.toLowerCase() === value.toLowerCase()
    );

    if (matchedOption) {
      setSelectedOption(matchedOption);
    } else {
      setSelectedOption(null);
    }

    onChange?.({
      selected: matchedOption?.value || null,
      inputValue: value,
    });
  };

  return (
    <div className={cn('grid gap-2', className)}>
      {label && <Label htmlFor="combined-select">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="combined-select"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            onClick={() => setOpen(true)}
          >
            <span className="truncate">{inputValue || placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={inputValue}
              onValueChange={handleInputChange}
              className="h-9"
            />
            <CommandList>
              <CommandGroup>
                {options
                  .filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedOption?.value === option.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
