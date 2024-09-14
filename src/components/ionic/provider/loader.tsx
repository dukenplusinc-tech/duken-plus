'use client';

import React, { PropsWithChildren } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';

setupIonicReact();

function IonicProvider({ children }: PropsWithChildren) {
  return <IonApp>{children}</IonApp>;
}

export default IonicProvider;
