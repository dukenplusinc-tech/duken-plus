'use client';

import { FC } from 'react';

import TransactionList from '@/lib/entities/cash-desk/containers/transaction-list';
import { useCashDeskEntries } from '@/lib/entities/cash-desk/hooks/useCashDeskEntries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const CashEntriesTabs: FC = () => {
  const { data: all } = useCashDeskEntries();
  const { data: cash } = useCashDeskEntries('cash');
  const { data: bank } = useCashDeskEntries('bank_transfer');

  return (
    <Tabs defaultValue="all" className="mb-4">
      <TabsList className="grid grid-cols-3 mb-2">
        <TabsTrigger value="all">Все</TabsTrigger>
        <TabsTrigger value="cash">Наличные</TabsTrigger>
        <TabsTrigger value="bank">Безнал</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <TransactionList transactions={all} />
      </TabsContent>
      <TabsContent value="cash">
        <TransactionList transactions={cash} />
      </TabsContent>
      <TabsContent value="bank">
        <TransactionList transactions={bank} />
      </TabsContent>
    </Tabs>
  );
};
