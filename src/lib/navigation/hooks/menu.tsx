import type { ReactNode } from 'react';
import { Home, LineChart, Settings, Smartphone } from 'lucide-react';

import * as fromUrl from '@/lib/url/generator';

export interface MenuItem {
  title: string;
  href: string;
  icon?: ReactNode;
}

const sideMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    href: fromUrl.toHome(),
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Devices',
    href: fromUrl.toDevices(),
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    title: 'Issues',
    href: fromUrl.toIssues(),
    icon: <LineChart className="h-5 w-5" />,
  },
];

const sideMenuBottom: MenuItem[] = [
  {
    title: 'Settings',
    href: fromUrl.toSettings(),
    icon: <Settings className="h-5 w-5" />,
  },
];

const asideMenu = {
  sideMenu,
  sideMenuBottom,
};

const headerMenu = [...sideMenu, ...sideMenuBottom];

export function useAsideMenu() {
  return asideMenu;
}

export function useHeaderMenu() {
  return headerMenu;
}
