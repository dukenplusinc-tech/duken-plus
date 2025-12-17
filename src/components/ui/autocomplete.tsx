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
  cancelButtonText?: string;
}

const defaultCustomValueMessage: AutocompleteProps['customValueMessage'] = (
  val
) => `Use "${val}"`;

// helpers
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
  cancelButtonText = 'Cancel',
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const normalized = useMemo(() => options.map(asOption), [options]);

  const selectedOption = useMemo(
    () => normalized.find((o) => o.value === value) || null,
    [normalized, value]
  );
  // fallback to raw value for custom entries
  const selectedLabel =
    selectedOption?.label ?? (allowCustomValue ? value : '');

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
    setSearchValue(o.label);
    onValueChange(o.value);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    if (!open) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length) {
        handleSelect(filteredOptions[0]);
      } else if (allowCustomValue && searchValue.trim()) {
        const v = searchValue.trim();
        handleSelect({ value: v, label: v });
      } else {
        setOpen(false);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setSearchValue(selectedLabel);
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
                              onClick={() => {
                                const v = searchValue.trim();
                                if (!v) return;
                                handleSelect({ value: v, label: v });
                              }}
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
                    {cancelButtonText}
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

  // --------------------------- Desktop popover (input is the trigger) ---------------------------
  return (
    <div className={cn('space-y-2 ml-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <Popover open={open} onOpenChange={handleOpenChange}>
          {/* Make the input the trigger to avoid button keyboard activation (Space/Enter) */}
          <PopoverTrigger asChild>
            <input
              ref={inputRef}
              type="text"
              value={open ? searchValue : selectedLabel}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                'w-full h-12 rounded-md border border-gray-300 bg-white px-3 pr-8',
                'outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls="autocomplete-listbox"
            />
          </PopoverTrigger>

          {/* Chevron toggle that doesn't steal focus from the input */}
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/50"
            onMouseDown={(e) => {
              e.preventDefault(); // keep input focused
              if (!disabled) setOpen((o) => !o);
            }}
            aria-label="Toggle"
            disabled={disabled}
          >
            <ChevronDown className="h-4 w-4 opacity-60" />
          </button>

          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={handleInputChange}
              />
              <CommandList id="autocomplete-listbox">
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
                        onClick={() => {
                          const v = searchValue.trim();
                          if (!v) return;
                          handleSelect({ value: v, label: v });
                        }}
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
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <>
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                isSelected ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {getOptionLabel(option)}
                          </>
                        )}
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
