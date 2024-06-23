'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as fromUrl from '@/lib/url/generator';
import { cn } from '@/lib/utils';

type SettingsMenuItem = {
  href: string;
  label: string;
};

const links: SettingsMenuItem[] = [
  {
    label: 'General',
    href: fromUrl.toSettings(),
  },
  {
    label: 'Security',
    href: fromUrl.toSecuritySettings(),
  },
  {
    label: 'Personal',
    href: fromUrl.toPersonalSettings(),
  },
];

export const SettingsMenu: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(link.href === pathname && 'font-semibold text-primary')}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
