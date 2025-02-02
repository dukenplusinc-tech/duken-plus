'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { EmployeeForm } from '@/lib/entities/employees/containers/create-employee/form';
import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { PageHeader } from '@/components/ui/page/header';

export const CreateEmployee: FC = () => {
  useActivateBackButton();

  const t = useTranslations('employees.create');

  return (
    <>
      <PageHeader>{t('header')}</PageHeader>
      <EmployeeForm />
    </>
  );
};
