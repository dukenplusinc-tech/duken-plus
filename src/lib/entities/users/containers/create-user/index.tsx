'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { UserForm } from '@/lib/entities/users/containers/create-user/form';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { PageHeader } from '@/components/ui/page/header';

export const InviteUser: FC = () => {
  useActivateBackButton();

  const t = useTranslations('users.invite');

  return (
    <>
      <PageHeader>{t('header')}</PageHeader>
      <UserForm />
    </>
  );
};
