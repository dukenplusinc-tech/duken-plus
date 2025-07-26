'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ClipboardList, NotebookPen } from 'lucide-react';

import ActionButtons from '@/lib/entities/home/containers/action-buttons';
import CompanyTab from '@/lib/entities/home/containers/company-tab';
import Consignment from '@/lib/entities/home/containers/consignment';
import ExpenseSummary from '@/lib/entities/home/containers/expense-summary';
import { fromUrl } from '@/lib/url';
import { Button } from '@/components/ui/button';

export const CompaniesTab: FC = () => {
  return (
    <>
      <CompanyTab />
      <ActionButtons />
      <ExpenseSummary />

      <div className="px-2 mt-4 space-y-2">
        <Button
          className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto mt-2 mb-4"
          asChild
        >
          <Link href="/stats">
            <ClipboardList size={28} className="mr-3" />{' '}
            <span className="text-lg">Статистика / отчеты</span>
          </Link>
        </Button>

        <Button
          className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto mt-2 mb-4"
          asChild
        >
          <Link href={fromUrl.toDeliveries()}>
            <NotebookPen size={28} className="mr-3" />
            <span className="text-lg">Фирмы на сегодня</span>
          </Link>
        </Button>
      </div>

      <Consignment count={13} />
    </>
  );
};
