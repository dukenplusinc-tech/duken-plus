import { FC } from 'react';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  alertCircleOutline,
  cardOutline,
  cashOutline,
  chatbubbleEllipsesOutline,
  closeOutline,
  documentOutline,
  homeOutline,
  location,
  peopleOutline,
  personOutline,
  settingsOutline,
  statsChartOutline,
} from 'ionicons/icons';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { useHeaderMenu } from '@/lib/navigation/hooks/menu';

export const Menu: FC = () => {
  const t = useTranslations('menu');

  const menuItems = useHeaderMenu();

  const { data: shop } = useShop();

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('mobile_header')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <span className="block font-bold">{shop?.title || '---'}</span>
          <span className="flex items-center">
            <IonIcon icon={location} className="h-5 w-5 mr-2" />
            {shop?.city || '---'}
          </span>
        </div>

        <IonList>
          <IonItem button>
            <IonIcon icon={homeOutline} slot="start" />
            <IonLabel>Home</IonLabel>
          </IonItem>
          <IonItem button>
            <IonIcon icon={peopleOutline} slot="start" />
            <IonLabel>Contractors</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};
