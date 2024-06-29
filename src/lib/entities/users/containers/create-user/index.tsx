'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';

import { UserForm } from './form';

export function CreateUserDialog() {
  const t = useTranslations('users.invite');

  const dialog = useModalDialog();

  const onOpen = () => {
    dialog.launch({
      render: <UserForm />,
      title: t('header'),
    });
  };

  return <Button onClick={onOpen}>{t('invite_button_caption')}</Button>;
}
