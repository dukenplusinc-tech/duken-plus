import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { SecuritySettingsForm } from '@/lib/entities/users/containers/security-settings-form/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const SecuritySettings: FC = () => {
  const t = useTranslations('settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('security.form_title')}</CardTitle>
        <CardDescription>{t('security.form_subtitle')}</CardDescription>
      </CardHeader>

      <SecuritySettingsForm />
    </Card>
  );
};
