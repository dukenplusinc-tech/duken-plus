import type { ReactNode } from 'react';
import {
  AlertTriangle,
  BarChart,
  Building,
  CheckSquare,
  DollarSign,
  Home,
  MessageCircle,
  Settings,
  StickyNote,
  Users,
  UserX,
} from 'lucide-react';

import * as fromUrl from '@/lib/url/generator';

export interface MenuItem {
  title: string;
  href: string;
  icon?: ReactNode;
}

const sideMenu: MenuItem[] = [
  {
    title: 'Home',
    href: fromUrl.toHome(),
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Contractors',
    href: fromUrl.toContractors(),
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: 'Debtors',
    href: fromUrl.toDebtors(),
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: 'Blacklist',
    href: fromUrl.toBlacklist(),
    icon: <UserX className="h-5 w-5" />,
  },
  {
    title: 'Cash Desk',
    href: fromUrl.toCashDesk(),
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: 'Notes',
    href: fromUrl.toNotes(),
    icon: <StickyNote className="h-5 w-5" />,
  },
  {
    title: 'Chat',
    href: fromUrl.toChat(),
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: 'Statistics',
    href: fromUrl.toStatistics(),
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: 'Subscription',
    href: fromUrl.toSubscription(),
    icon: <CheckSquare className="h-5 w-5" />,
  },
];

const sideMenuBottom: MenuItem[] = [
  {
    title: 'Users',
    href: fromUrl.toUsers(),
    icon: <Users className="h-5 w-5" />,
  },
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
