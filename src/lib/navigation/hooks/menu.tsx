'use client';

import { ReactNode, useMemo } from 'react';
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

import { RoleScope } from '@/lib/entities/roles/types';
import { useUserRole } from '@/lib/entities/users/hooks/useUserRole';
import * as fromUrl from '@/lib/url/generator';

export interface MenuItem {
  title: string;
  href: string;
  icon?: ReactNode;
  scope?: RoleScope;
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
    scope: RoleScope.debtor,
  },
  {
    title: 'Blacklist',
    href: fromUrl.toBlacklist(),
    icon: <UserX className="h-5 w-5" />,
    scope: RoleScope.debtor,
  },
  {
    title: 'Cash Desk',
    href: fromUrl.toCashDesk(),
    icon: <DollarSign className="h-5 w-5" />,
    scope: RoleScope.cashDesk,
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
    scope: RoleScope.users,
  },
  {
    title: 'Settings',
    href: fromUrl.toSettings(),
    icon: <Settings className="h-5 w-5" />,
  },
];

export function useFilterByScope(list: MenuItem[]) {
  const role = useUserRole();

  return useMemo(() => {
    if (!role) {
      return [];
    }

    return list.filter(({ scope }) => {
      if (!scope) {
        return true;
      }

      return role.scope.includes(scope as string);
    });
  }, [list, role]);
}

export function useAsideMenu() {
  const side = useFilterByScope(sideMenu);
  const menuBottom = useFilterByScope(sideMenuBottom);

  return useMemo(
    () => ({
      sideMenu: side,
      sideMenuBottom: menuBottom,
    }),
    [menuBottom, side]
  );
}

const headerMenu = [...sideMenu, ...sideMenuBottom];

export function useHeaderMenu() {
  return useFilterByScope(headerMenu);
}
