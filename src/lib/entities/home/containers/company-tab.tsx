'use client';

import { FC, useState } from 'react';
import { Check, Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTotalExpenses } from '@/lib/entities/expenses/hooks/useTotalExpenses';

interface Company {
  id: number;
  name: string;
  amount: string;
  accepted: boolean;
}

const ExpenseSummary: FC = () => {
  const t = useTranslations('expenses');
  const { totalToday, loading } = useTotalExpenses();

  return (
    <div className="bg-primary text-white p-3 border-t border-primary-foreground/20">
      <div className="text-center">
        {t('summary.today_label')} &nbsp;
        {loading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          `${totalToday} тг`
        )}
      </div>
    </div>
  );
};

export default function CompanyTab() {
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

  const totalAmount = '567.500';
  const remainingCompanies = 2;
  const remainingAmount = '132.000';

  return (
    <div className="mt-2">
      {/* Summary Banner */}
      <div className="text-white">
        <div className="bg-primary p-4 mb-2">
          <div className="flex justify-center items-center">
            <div className="flex-1 text-lg">На сегодня</div>
            <div className="flex-1 text-3xl font-bold">6 ФИРМ</div>
          </div>
          <div className="flex justify-center items-center mt-2">
            <div className="flex-1 text-lg">На сумму</div>
            <div className="flex-1 text-3xl font-bold">{totalAmount} тг</div>
          </div>
        </div>

        {/* Remaining Companies */}
        <div className="bg-primary mb-2 text-white p-3 border-t border-primary-foreground/20">
          <div className="text-center">
            Осталось: {remainingCompanies} фирмы на сумму {remainingAmount} тг
          </div>
        </div>

        <ExpenseSummary />
      </div>

      {/* Table */}
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
              {company.accepted ? (
                <button
                  className="bg-success w-10 h-10 rounded flex items-center justify-center"
                  onClick={() => toggleAccepted(company.id)}
                >
                  <Check className="text-success-foreground" />
                </button>
              ) : (
                <button
                  className="bg-success/20 w-10 h-10 rounded"
                  onClick={() => toggleAccepted(company.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
