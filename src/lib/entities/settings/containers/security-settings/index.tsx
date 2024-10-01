import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { SecuritySettingsForm } from '@/lib/entities/users/containers/security-settings-form/form';
import { PageHeader } from '@/components/ui/page/header';

export const SecuritySettings: FC = () => {
  const t = useTranslations('settings.security');

  return (
    <div className="flex flex-col h-full">
      <PageHeader>{t('form_title')}</PageHeader>
      <SecuritySettingsForm />
    </div>
  );
};
