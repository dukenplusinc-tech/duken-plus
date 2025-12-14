'use client';

import React, { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import * as icons from 'ionicons/icons';

import { PersonalSettings } from '@/lib/entities/settings/containers/personal-settings';
import { SecuritySettings } from '@/lib/entities/settings/containers/security-settings';
import { GeneralShopSettings } from '@/lib/entities/shop/containers/general-shop-settings';

interface TabItemType {
  id: string;
  titleKey: string;
  icon?: string;
  render?: ReactNode;
}

export const PreferencesTabLayout: FC = () => {
  const t = useTranslations('settings');

  const tabs: TabItemType[] = [
    {
      id: 'general',
      titleKey: 'general.title',
      icon: icons.settingsOutline,
      render: <GeneralShopSettings />,
    },
    {
      id: 'security',
      titleKey: 'security.title',
      icon: icons.lockClosedOutline,
      render: <SecuritySettings />,
    },
    {
      id: 'personal',
      titleKey: 'personal.title',
      icon: icons.personOutline,
      render: <PersonalSettings />,
    },
  ];

  return (
    <IonTabs>
      {tabs.map((tab) => (
        <IonTab key={tab.id} tab={tab.id}>
          <div className="overflow-auto ion-padding">
            {tab.render || 'Empty'}
          </div>
        </IonTab>
      ))}

      <IonTabBar slot="bottom">
        {tabs.map((tab) => (
          <IonTabButton key={tab.id} tab={tab.id}>
            <IonIcon icon={tab.icon} />
            {t(tab.titleKey)}
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};
