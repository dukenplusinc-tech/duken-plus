'use client';

import { useMemo } from 'react';
import * as icons from 'ionicons/icons';

import { RoleScope } from '@/lib/entities/roles/types';
import { useUserRole } from '@/lib/entities/users/hooks/useUserRole';
import * as fromUrl from '@/lib/url/generator';

export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
  scope?: RoleScope;
}

const sideMenu: MenuItem[] = [
  {
    title: 'label_home',
    href: fromUrl.toHome(),
    icon: icons.homeOutline,
  },
  {
    title: 'label_contractors',
    href: fromUrl.toContractors(),
    icon: icons.buildOutline,
  },
  {
    title: 'label_debtors',
    href: fromUrl.toDebtors(),
    icon: icons.alertOutline,
    scope: RoleScope.debtor,
  },
  {
    title: 'label_blacklist',
    href: fromUrl.toBlacklist(),
    icon: icons.personOutline,
    scope: RoleScope.debtor,
  },
  {
    title: 'label_cash_desk',
    href: fromUrl.toCashDesk(),
    icon: icons.cashOutline,
    scope: RoleScope.cashDesk,
  },
  {
    title: 'label_notes',
    href: fromUrl.toNotes(),
    icon: icons.listOutline,
  },
  {
    title: 'label_chat',
    href: fromUrl.toChat(),
    icon: icons.chatboxOutline,
  },
  {
    title: 'label_statistics',
    href: fromUrl.toStatistics(),
    icon: icons.barbellOutline,
    scope: RoleScope.store,
  },
  {
    title: 'label_subscription',
    href: fromUrl.toSubscription(),
    icon: icons.checkboxOutline,
    scope: RoleScope.store,
  },
];

const sideMenuBottom: MenuItem[] = [
  {
    title: 'label_employees',
    href: fromUrl.toEmployees(),
    icon: icons.personOutline,
    scope: RoleScope.users,
  },
  {
    title: 'label_users',
    href: fromUrl.toUsers(),
    icon: icons.personCircleSharp,
    scope: RoleScope.users,
  },
  {
    title: 'label_settings',
    href: fromUrl.toSettings(),
    icon: icons.settingsOutline,
    scope: RoleScope.store,
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

const headerMenu = [...sideMenu, ...sideMenuBottom];

export function useHeaderMenu() {
  return useFilterByScope(headerMenu);
}
