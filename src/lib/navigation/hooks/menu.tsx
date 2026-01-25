'use client';

import { useMemo } from 'react';
import * as icons from 'ionicons/icons';

import { RoleScope } from '@/lib/entities/roles/types';
import { useUserRole } from '@/lib/entities/users/hooks/useUserRole';
import { useEmployeeMode } from '@/lib/entities/employees/context';
import * as fromUrl from '@/lib/url/generator';

export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
  scope?: RoleScope;
  hideForEmployees?: boolean;
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
  // {
  //   title: 'label_users',
  //   href: fromUrl.toUsers(),
  //   icon: icons.personCircleSharp,
  //   scope: RoleScope.users,
  // },
  {
    title: 'label_settings',
    href: fromUrl.toSettings(),
    icon: icons.settingsOutline,
    hideForEmployees: true,
  },
];

export function useFilterByScope(list: MenuItem[]) {
  const role = useUserRole();
  const employeeMode = useEmployeeMode();

  return useMemo(() => {
    if (!role) {
      return [];
    }

    return list.filter(({ scope, hideForEmployees }) => {
      // Hide items marked for employees
      if (hideForEmployees && employeeMode.isEmployee) {
        return false;
      }

      // Filter by scope if specified
      if (!scope) {
        return true;
      }

      return role.scope.includes(scope as string);
    });
  }, [list, role, employeeMode.isEmployee]);
}

const headerMenu = [...sideMenu, ...sideMenuBottom];

export function useHeaderMenu() {
  return useFilterByScope(headerMenu);
}
