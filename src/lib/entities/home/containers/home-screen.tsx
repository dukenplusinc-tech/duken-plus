'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

import ActionButtons from '@/lib/entities/home/containers/action-buttons';
import CompanyTab from '@/lib/entities/home/containers/company-tab';
import Consignment from '@/lib/entities/home/containers/consignment';
import ExpenseSummary from '@/lib/entities/home/containers/expense-summary';
import DebtorTab from '@/lib/entities/home/containers/tabs/debtor-tab';
import { Button } from '@/components/ui/button';

export const HomeScreen: FC = () => {
  const [activeTab, setActiveTab] = useState<'companies' | 'debtors'>(
    'companies'
  );

  return (
    <>
      {/* Tabs */}
      <div className="flex border rounded-lg mt-2 overflow-hidden">
        <button
          className={`flex-1 py-3 text-xl font-bold ${
            activeTab === 'companies'
              ? 'bg-primary text-primary-foreground'
              : 'bg-white text-primary'
          }`}
          onClick={() => setActiveTab('companies')}
        >
          Фирмы
        </button>
        <button
          className={`flex-1 py-3 text-xl font-bold ${
            activeTab === 'debtors'
              ? 'bg-primary text-primary-foreground'
              : 'bg-white text-primary'
          }`}
          onClick={() => setActiveTab('debtors')}
        >
          Должники
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'companies' && (
        <>
          <CompanyTab />
          <ActionButtons />
          <ExpenseSummary />

          <div className="px-2 mt-4 space-y-2">
            {/* Stats Button */}
            <Button
              className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto mt-2 mb-4"
              asChild
            >
              <Link href="/stats">
                <ClipboardList size={28} className="mr-3" />{' '}
                <span className="text-lg">Статистика / отчеты</span>
              </Link>
            </Button>
          </div>

          <Consignment count={13} />
        </>
      )}

      {activeTab === 'debtors' && <DebtorTab />}
    </>
  );
};
