'use client';

import React, { PropsWithChildren } from 'react';
import {
  IonApp,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from '@ionic/react';

import { Menu } from '@/components/navigation/menu';

setupIonicReact();

function IonicProvider({ children }: PropsWithChildren) {
  return <IonApp>{children}</IonApp>;
}

export default IonicProvider;
