import { FC } from 'react';
import Link from 'next/link';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { location } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { useEmployeeMode } from '@/lib/entities/employees/context';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { UserSwitcher } from '@/lib/entities/users/containers/user-switcher';
import { useHeaderMenu } from '@/lib/navigation/hooks/menu';

const MenuList: FC = () => {
  const t = useTranslations('menu');

  const menuItems = useHeaderMenu();
  const employeeMode = useEmployeeMode();

  if (!menuItems?.length || employeeMode.isLoading) {
    return (
      <div className="flex justify-center">
        <IonSpinner name="dots" />
      </div>
    );
  }

  return (
    <>
      <UserSwitcher />

      <IonList>
        {menuItems.map((menuItem, idx) => (
          <Link
            key={`${menuItem.title}_${idx.toString()}`}
            href={menuItem.href}
          >
            <IonMenuToggle>
              <IonItem>
                {typeof menuItem.icon === 'string' && (
                  <IonIcon icon={menuItem.icon} slot="start" />
                )}
                <IonLabel>{t(menuItem.title)}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </Link>
        ))}
      </IonList>
    </>
  );
};

export const Menu: FC = () => {
  const t = useTranslations('menu');

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

        <MenuList />
      </IonContent>
    </IonMenu>
  );
};
