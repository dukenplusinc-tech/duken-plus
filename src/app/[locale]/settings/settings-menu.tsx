'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import * as fromUrl from '@/lib/url/generator';
import { cn } from '@/lib/utils';

type SettingsMenuItem = {
  href: string;
  label: string;
};

const links: SettingsMenuItem[] = [
  {
    label: 'general.title',
    href: fromUrl.toSettings(),
  },
  {
    label: 'security.title',
    href: fromUrl.toSecuritySettings(),
  },
  {
    label: 'personal.title',
    href: fromUrl.toPersonalSettings(),
  },
];

export const SettingsMenu: FC = () => {
  const t = useTranslations('settings');
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(link.href === pathname && 'font-semibold text-primary')}
        >
          {t(link.label)}
        </Link>
      ))}
    </nav>
  );
};
