'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { ShoppingBag as LogoIcon, MapPin, PanelLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { brand } from '@/config/brand';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { UserDropDownNav } from '@/lib/entities/users/containers/user-drop-down-nav';
import { useBreadcrumbsLinks } from '@/lib/navigation/breadcrumbs/context';
import { useHeaderMenu } from '@/lib/navigation/hooks/menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PageBreadcrumbs } from '@/components/page/breadcrumbs';
import { SearchComboBox } from '@/components/search-combo-box';

export const HeaderNav: FC = () => {
  const t = useTranslations('menu');

  const menuItems = useHeaderMenu();
  const breadcrumbLinks = useBreadcrumbsLinks();

  const { data: shop } = useShop();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium mb-10">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <LogoIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">{brand.name}</span>
            </Link>

            <div>
              <span className="block font-bold">{shop?.title || '---'}</span>
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {shop?.city || '---'}
              </span>
            </div>
          </nav>
          <ScrollArea style={{ height: 'calc(100vh - 200px)' }}>
            <nav className="grid gap-6 text-lg font-medium">
              {menuItems.map((menu, idx) => (
                <Link
                  key={idx.toString()}
                  href={menu.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  {menu.icon}
                  {t(menu.title)}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {breadcrumbLinks?.length > 0 && (
        <PageBreadcrumbs links={breadcrumbLinks} />
      )}

      <div className="relative ml-auto flex-1 md:grow-0">
        <SearchComboBox />
      </div>

      <UserDropDownNav />
    </header>
  );
};
