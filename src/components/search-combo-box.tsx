'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import * as fromUrl from '@/lib/url/generator';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Command {
  type: 'issues' | 'devices' | 'settings' | string;
  label: string;
  href?: string;
}

const suggestedCommands: Command[] = [
  {
    type: 'settings',
    label: 'Settings',
    href: fromUrl.toSettings(),
  },
];

export function SearchComboBox() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleChoose = useCallback(
    (itemType: Command['type']) => {
      const suggested = suggestedCommands.find(({ type }) => type === itemType);

      if (suggested?.href) {
        router.push(suggested.href);
      }
    },
    [router]
  );

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Quick access...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {suggestedCommands.map(({ type, label }) => (
              <CommandItem key={type} datatype={type} onSelect={handleChoose}>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
