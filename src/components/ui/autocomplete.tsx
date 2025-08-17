'use client';

import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
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

// -- helpers ---------------------------------------------------------

function asOption(opt: string | AutocompleteOption): AutocompleteOption {
  return typeof opt === 'string' ? { value: opt, label: opt } : opt;
}
function getOptionValue(opt: string | AutocompleteOption) {
  return asOption(opt).value;
}
function getOptionLabel(opt: string | AutocompleteOption) {
  return asOption(opt).label;
}

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
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const normalized = useMemo(() => options.map(asOption), [options]);

  // Find the currently selected option (by value/uuid)
  const selectedOption = useMemo(
    () => normalized.find((o) => o.value === value) || null,
    [normalized, value]
  );
  const selectedLabel = selectedOption?.label ?? '';

  // Keep the visible text in sync with the selected label
  useEffect(() => {
    if (!open) setSearchValue(selectedLabel);
  }, [selectedLabel, open]);

  const customValueMessage =
    propsCustomValueMessage ?? defaultCustomValueMessage;

  const defaultFilterFn = (
    option: string | AutocompleteOption,
    search: string
  ): boolean => {
    const o = asOption(option);
    const q = (search || '').toLowerCase();
    return (
      o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  };

  const filteredOptions = useMemo(
    () =>
      normalized.filter((o) => (filterFn || defaultFilterFn)(o, searchValue)),
    [normalized, filterFn, searchValue]
  );

  const handleSelect = (opt: string | AutocompleteOption) => {
    const o = asOption(opt);
    setSearchValue(o.label); // show label
    onValueChange(o.value); // store value (uuid)
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue); // typing should NOT change parent value
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Optional: pick the first filtered item on Enter
      if (filteredOptions.length) {
        handleSelect(filteredOptions[0]);
      } else if (allowCustomValue && searchValue) {
        handleSelect({ value: searchValue, label: searchValue });
      } else {
        setOpen(false);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // when opening, start with the current label so it can be edited
      setSearchValue(selectedLabel);
      // focus the input in the popover/dialog on next tick
      setTimeout(() => inputRef.current?.focus(), 0);
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

  // --------------------- Mobile full-screen dialog ---------------------
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
            <span
              className={cn('text-left', !selectedLabel && 'text-gray-500')}
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-full h-full max-h-full p-0 gap-0">
              <DialogTitle className="hidden">autocomplete</DialogTitle>
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
                              onClick={() =>
                                handleSelect({
                                  value: searchValue,
                                  label: searchValue,
                                })
                              }
                            >
                              {customValueMessage(searchValue)}
                            </Button>
                          )}
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((option) => {
                        const isSelected = value === option.value;
                        return (
                          <CommandItem
                            key={option.value}
                            value={`${option.label} ${option.value}`}
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

  // --------------------------- Desktop popover ---------------------------
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
                value={open ? searchValue : selectedLabel} // <-- show label when closed
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
                        onClick={() =>
                          handleSelect({
                            value: searchValue,
                            label: searchValue,
                          })
                        }
                      >
                        {customValueMessage(searchValue)}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={`${option.label} ${option.value}`}
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
