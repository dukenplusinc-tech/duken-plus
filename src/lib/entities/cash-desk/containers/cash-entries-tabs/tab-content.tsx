'use client';

import { FC, RefObject } from 'react';
import { IonSpinner } from '@ionic/react';

import { TabsContent } from '@/components/ui/tabs';
import TransactionList from '@/lib/entities/cash-desk/containers/transaction-list';
import { CashRegister } from '@/lib/entities/cash-desk/schema';

interface Props {
  value: string;
  transactions: CashRegister[];
  loading: boolean;
  sentinelRef: RefObject<HTMLDivElement>;
}

export const CashEntriesTabContent: FC<Props> = ({
  value,
  transactions,
  loading,
  sentinelRef,
}) => (
  <TabsContent value={value}>
    <TransactionList transactions={transactions} />
    {loading && (
      <div className="flex justify-center p-4">
        <IonSpinner name="dots" />
      </div>
    )}
    <div ref={sentinelRef} className="sentinel" />
  </TabsContent>
);

export default CashEntriesTabContent;
