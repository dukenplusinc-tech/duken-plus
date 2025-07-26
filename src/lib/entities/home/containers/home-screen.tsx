'use client';

import { FC, useState } from 'react';

import { CompaniesTab } from '@/lib/entities/home/containers/tabs/companies-tab';
import { DebtorTab } from '@/lib/entities/home/containers/tabs/debtor-tab';

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

      {activeTab === 'companies' && <CompaniesTab />}
      {activeTab === 'debtors' && <DebtorTab />}
    </>
  );
};
