'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { ShoppingBag as LogoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { brand } from '@/config/brand';
import { MenuItem, useAsideMenu } from '@/lib/navigation/hooks/menu';
import * as fromUrl from '@/lib/url/generator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MenuList: FC<{ menu: MenuItem[] }> = ({ menu: menuList }) => {
  const t = useTranslations('menu');

  return (
    <>
      {menuList.map((menu, idx) => (
        <Tooltip key={idx.toString()}>
          <TooltipTrigger asChild>
            <Link
              href={menu.href}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              {menu.icon}
              <span className="sr-only">{t(menu.title)}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{t(menu.title)}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );
};

export const AsideNav: FC = () => {
  const { sideMenu, sideMenuBottom } = useAsideMenu();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href={fromUrl.toHome()}
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <LogoIcon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">{brand.name}</span>
        </Link>

        <MenuList menu={sideMenu} />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <MenuList menu={sideMenuBottom} />
      </nav>
    </aside>
  );
};
