import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { UpdateShopForm } from '@/lib/entities/shop/containers/shop-form/form';
import { PageHeader } from '@/components/ui/page/header';

export const GeneralShopSettings: FC = () => {
  const t = useTranslations('settings');

  return (
    <div className="flex flex-col h-full">
      <PageHeader>{t('general.form_title')}</PageHeader>
      <UpdateShopForm />
    </div>
  );
};
