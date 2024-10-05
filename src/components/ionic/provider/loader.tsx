'use client';

import React, { PropsWithChildren } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';

import { BackButtonProvider } from '@/lib/navigation/back-button/context';

setupIonicReact();

function IonicProvider({ children }: PropsWithChildren) {
  return (
    <BackButtonProvider>
      <IonApp>{children}</IonApp>
    </BackButtonProvider>
  );
}

export default IonicProvider;
