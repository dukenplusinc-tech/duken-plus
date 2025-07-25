'use client';

import { FC, useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useActivateBackButton } from '@/lib/navigation/back-button/hooks';
import { cn } from '@/lib/utils';
import { PageHeader, PageSubHeader } from '@/components/ui/page/header';
import { EmptyScreen } from '@/components/ui/page/screen/empty';
import { ErrorScreen } from '@/components/ui/page/screen/error';
import { Money } from '@/components/numbers/money';

interface Company {
  id: number;
  name: string;
  amount: string;
  accepted: boolean;
}

export const DeliveriesTable: FC = () => {
  const t = useTranslations('deliveries');

  useActivateBackButton();

  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: '1. Кока кола', amount: '94.583 тг', accepted: false },
    { id: 2, name: '2. Горилла', amount: '94.583 тг', accepted: false },
    { id: 3, name: '3. Агуша', amount: '94.583 тг', accepted: true },
    { id: 4, name: '4. Лейс', amount: '94.583 тг', accepted: true },
    { id: 5, name: '5. Бетта инк.', amount: '94.583 тг', accepted: true },
    { id: 6, name: '6. Карлсберг', amount: '94.583 тг', accepted: false },
  ]);

  const toggleAccepted = (id: number) => {
    setCompanies(
      companies.map((company) =>
        company.id === id
          ? { ...company, accepted: !company.accepted }
          : company
      )
    );
  };

  let error = null;
  let isLoading = false;
  let data: any[] = companies;

  const isEmpty = !isLoading && data.length === 0;

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="mb-4">{t('title')}</PageHeader>
      <PageSubHeader className="mb-4">
        <>
          <span className="block mb-2">
            <span>6</span> ФИРМ на сумму
          </span>

          <Money>{45435333}</Money>
        </>
      </PageSubHeader>

      {error && <ErrorScreen error={error} />}

      {isEmpty && <EmptyScreen>{t('empty_text')}</EmptyScreen>}

      {!isEmpty && (
        <div className="bg-white mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b">
            <div className="p-4 font-bold border-r">Название</div>
            <div className="p-4 font-bold border-r">Сумма</div>
            <div className="p-4 font-bold">Принять</div>
          </div>

          {/* Table Rows */}
          {companies.map((company) => (
            <div
              key={company.id}
              className={`grid grid-cols-3 border-b ${company.id % 2 === 0 ? 'bg-success/10' : 'bg-white'}`}
            >
              <div className="p-4 border-r">{company.name}</div>
              <div className="p-4 border-r font-bold text-primary">
                {company.amount}
              </div>
              <div className="p-4">
                <button
                  className={cn(
                    company.accepted ? 'bg-success' : 'bg-success/20',
                    'w-10 h-10 rounded flex items-center justify-center'
                  )}
                  onClick={() => toggleAccepted(company.id)}
                >
                  {company.accepted && (
                    <Check className="text-success-foreground" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
