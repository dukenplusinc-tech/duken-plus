'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

export interface AutocompleteOption {
  value: string;
  label: string;

  [key: string]: any;
}

interface AutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[] | AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  allowCustomValue?: boolean;
  customValueMessage?: (value: string) => string;
  filterFn?: (option: string | AutocompleteOption, search: string) => boolean;
  renderOption?: (
    option: string | AutocompleteOption,
    isSelected: boolean
  ) => React.ReactNode;
}

const defaultCustomValueMessage: AutocompleteProps['customValueMessage'] = (
  val
) => `Use "${val}"`;

export function Autocomplete({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option...',
  disabled = false,
  label,
  error,
  className,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  allowCustomValue = false,
  customValueMessage: propsCustomValueMessage,
  filterFn,
  renderOption,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const customValueMessage: AutocompleteProps['customValueMessage'] =
    propsCustomValueMessage ?? defaultCustomValueMessage;

  // Default filter function
  const defaultFilterFn = (
    option: string | AutocompleteOption,
    search: string
  ): boolean => {
    const searchLower = search.toLowerCase();
    if (typeof option === 'string') {
      return option.toLowerCase().includes(searchLower);
    }
    return (
      option.label.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower)
    );
  };

  const filteredOptions = options.filter((option) =>
    (filterFn || defaultFilterFn)(option, searchValue)
  );

  // Get display value for an option
  const getOptionValue = (option: string | AutocompleteOption): string => {
    return typeof option === 'string' ? option : option.value;
  };

  // Get display label for an option
  const getOptionLabel = (option: string | AutocompleteOption): string => {
    return typeof option === 'string' ? option : option.label;
  };

  const handleSelect = (selectedOption: string | AutocompleteOption) => {
    const optionValue = getOptionValue(selectedOption);
    setSearchValue(optionValue);
    onValueChange(optionValue);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    onValueChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && isMobile) {
      setSearchValue(value);
    }
  };

  const renderDefaultOption = (
    option: string | AutocompleteOption,
    isSelected: boolean
  ) => (
    <>
      <Check
        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {getOptionLabel(option)}
    </>
  );

  const renderMobileOption = (
    option: string | AutocompleteOption,
    isSelected: boolean
  ) => (
    <>
      <Check
        className={cn('mr-3 h-5 w-5', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {getOptionLabel(option)}
    </>
  );

  // Mobile full-screen dialog
  if (isMobile) {
    return (
      <div className={cn('space-y-2 w-full', className)}>
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
            className="w-full justify-between h-12 bg-white border border-gray-300 hover:border-gray-400 font-normal"
            disabled={disabled}
          >
            <span className={cn('text-left', !value && 'text-gray-500')}>
              {value || placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-full h-full max-h-full p-0 gap-0">
              <div className="flex-1 flex flex-col">
                <Command className="flex-1">
                  <div className="p-4">
                    <CommandInput
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onValueChange={handleInputChange}
                      className="h-12 text-base"
                    />
                  </div>
                  <CommandList className="flex-1 px-4">
                    <CommandEmpty>
                      <div className="py-8 text-center">
                        {!(allowCustomValue && customValueMessage) && (
                          <p className="text-gray-500 mb-4">{emptyMessage}</p>
                        )}
                        {allowCustomValue &&
                          searchValue &&
                          customValueMessage && (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => handleSelect(searchValue)}
                            >
                              {customValueMessage(searchValue)}
                            </Button>
                          )}
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((option, index) => {
                        const optionValue = getOptionValue(option);
                        const isSelected = value === optionValue;
                        return (
                          <CommandItem
                            key={`${optionValue}-${index}`}
                            value={optionValue}
                            onSelect={() => handleSelect(option)}
                            className="py-4 text-base cursor-pointer"
                          >
                            {renderOption
                              ? renderOption(option, isSelected)
                              : renderMobileOption(option, isSelected)}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>

                <div className="p-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  // Desktop popover
  return (
    <div className={cn('space-y-2 ml-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-12 bg-white border border-gray-300 hover:border-gray-400 font-normal"
              disabled={disabled}
            >
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-left"
                disabled={disabled}
              />
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={handleInputChange}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="p-2">
                    {!(allowCustomValue && customValueMessage) && (
                      <p className="text-sm text-muted-foreground">
                        {emptyMessage}
                      </p>
                    )}
                    {allowCustomValue && searchValue && customValueMessage && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full mt-2 justify-start"
                        onClick={() => handleSelect(searchValue)}
                      >
                        {customValueMessage(searchValue)}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option, index) => {
                    const optionValue = getOptionValue(option);
                    const isSelected = value === optionValue;
                    return (
                      <CommandItem
                        key={`${optionValue}-${index}`}
                        value={optionValue}
                        onSelect={() => handleSelect(option)}
                      >
                        {renderOption
                          ? renderOption(option, isSelected)
                          : renderDefaultOption(option, isSelected)}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
