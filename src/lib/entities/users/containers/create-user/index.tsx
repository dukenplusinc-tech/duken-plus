'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { UserForm } from '@/lib/entities/users/containers/create-user/form';
import { PageHeader } from '@/components/ui/page/header';

export const InviteUser: FC = () => {
  const t = useTranslations('users.invite');

  return (
    <>
      <PageHeader>{t('header')}</PageHeader>
      <UserForm />
    </>
  );
};
