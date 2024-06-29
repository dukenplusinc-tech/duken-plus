import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { PersonalSettingsForm } from '@/lib/entities/users/containers/personal-settings-form/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const PersonalSettings: FC = () => {
  const t = useTranslations('settings.personal');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('form_title')}</CardTitle>
        <CardDescription>{t('form_subtitle')}</CardDescription>
      </CardHeader>

      <PersonalSettingsForm />
    </Card>
  );
};
