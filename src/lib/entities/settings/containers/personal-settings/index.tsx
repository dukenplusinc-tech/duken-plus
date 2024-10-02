import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { PersonalSettingsForm } from '@/lib/entities/users/containers/personal-settings-form/form';
import { PageHeader } from '@/components/ui/page/header';

export const PersonalSettings: FC = () => {
  const t = useTranslations('settings.personal');

  return (
    <div className="flex flex-col h-full">
      <PageHeader>{t('form_title')}</PageHeader>
      <PersonalSettingsForm />
    </div>
  );
};
