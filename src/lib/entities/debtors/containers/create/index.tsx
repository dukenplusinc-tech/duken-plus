'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { DebtorForm } from '@/lib/entities/debtors/containers/form/form';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { PageHeader } from '@/components/ui/page/header';

export const DebtorPageForm: FC<{ id?: string }> = ({ id }) => {
  useActivateBackButton();

  const t = useTranslations('debtors');

  return (
    <>
      <PageHeader>{t(id ? 'title_edit' : 'title_add')}</PageHeader>
      <DebtorForm id={id} />
    </>
  );
};
