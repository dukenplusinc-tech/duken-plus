import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { UpdateShopForm } from '@/lib/entities/shop/containers/shop-form/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const GeneralShopSettings: FC = () => {
  const t = useTranslations('settings');

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>{t('general.form_title')}</CardTitle>
        <CardDescription>{t('general.form_subtitle')}</CardDescription>
      </CardHeader>

      <UpdateShopForm />
    </Card>
  );
};
