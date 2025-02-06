'use client';

import React, { PropsWithChildren } from 'react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { IonApp, setupIonicReact } from '@ionic/react';

import { EmployeeModeProvider } from '@/lib/entities/employees/context';
import { BackButtonProvider } from '@/lib/navigation/back-button/context';

// Call the element loader before the render call
defineCustomElements(window);

setupIonicReact();

function IonicProvider({ children }: PropsWithChildren) {
  return (
    <BackButtonProvider>
      <EmployeeModeProvider>
        <IonApp>{children}</IonApp>
      </EmployeeModeProvider>
    </BackButtonProvider>
  );
}

export default IonicProvider;
