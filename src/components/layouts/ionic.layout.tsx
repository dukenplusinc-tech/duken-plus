'use client';

import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

import { useBackButton } from '@/lib/navigation/back-button/context';
import { DateDisplay } from '@/components/date/date-display';
import { Menu } from '@/components/navigation/menu';

export const IonicLayout: FC<PropsWithChildren> = ({ children }) => {
  const { showBackButton, backButtonUrl } = useBackButton();

  const router = useRouter();

  const handleBackClick = () => {
    if (backButtonUrl) {
      router.push(backButtonUrl);
    } else {
      router.back();
    }
  };

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              {showBackButton ? (
                // Back Button if `showBackButton` is true
                <IonButton fill="clear" onClick={handleBackClick}>
                  <IonIcon slot="icon-only" icon={arrowBack} />
                </IonButton>
              ) : (
                // Otherwise, show the Menu Button
                <IonMenuButton className="bg-primary text-white rounded-xl" />
              )}
            </IonButtons>

            {/* Center Title or Right-aligned Date */}
            <IonTitle className="text-right">
              <DateDisplay />
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">{children}</IonContent>
      </IonPage>
    </>
  );
};
