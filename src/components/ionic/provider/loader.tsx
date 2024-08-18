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
  return (
    <IonApp>
      <Menu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>todo: put there date</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">{children}</IonContent>
      </IonPage>
    </IonApp>
  );
}

export default IonicProvider;
