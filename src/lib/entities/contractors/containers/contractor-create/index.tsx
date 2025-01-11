'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ContractorForm } from '@/lib/entities/contractors/containers/contractor-form/form';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { PageHeader } from '@/components/ui/page/header';

export const ContractorPage: FC<{ id?: string }> = ({ id }) => {
  useActivateBackButton();

  const t = useTranslations('contractors');

  return (
    <>
      <PageHeader>{t(id ? 'title_edit' : 'title_add')}</PageHeader>
      <ContractorForm id={id} />
    </>
  );
};
