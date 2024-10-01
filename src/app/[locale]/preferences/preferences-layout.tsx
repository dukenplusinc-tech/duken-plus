'use client';

import React, { FC, ReactNode } from 'react';
import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import * as icons from 'ionicons/icons';

import { PersonalSettings } from '@/lib/entities/settings/containers/personal-settings';

interface TabItemType {
  id: string;
  title: string;
  icon?: string;
  render?: ReactNode;
}

const tabs: TabItemType[] = [
  {
    id: 'general',
    title: 'General',
    icon: icons.settingsOutline,
    render: <div>General</div>,
  },
  {
    id: 'personal',
    title: 'Personal',
    icon: icons.personOutline,
    render: <PersonalSettings />,
  },
  {
    id: 'security',
    title: 'Security',
    icon: icons.lockClosedOutline,
    render: <div>Security</div>,
  },
];

export const PreferencesTabLayout: FC = () => {
  return (
    <IonTabs>
      {tabs.map((tab) => (
        <IonTab key={tab.id} tab={tab.id}>
          <div className="ion-padding">{tab.render || 'Empty'}</div>
        </IonTab>
      ))}

      <IonTabBar slot="bottom">
        {tabs.map((tab) => (
          <IonTabButton key={tab.id} tab={tab.id}>
            <IonIcon icon={tab.icon} />
            {tab.title}
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};
