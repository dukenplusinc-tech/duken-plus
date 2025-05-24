'use client';

import { CalendarRange, Plus } from 'lucide-react';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { useAddCashRegisterEntryForm } from '@/lib/entities/cash-desk/containers/add-cash-register-entry';
import TransactionList from '@/lib/entities/cash-desk/containers/transaction-list';
import { useCashDeskStat } from '@/lib/entities/cash-desk/hooks/useCashDeskStat';
import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Money } from '@/components/numbers/money';

export default function CashRegisterPage() {
  const stats = useCashDeskStat();
  const handleAddTransaction = useAddCashRegisterEntryForm();

  // Sample data for demonstration
  const transactions = [
    {
      id: 1,
      date: '19.04.2025',
      type: 'Kaspi',
      amount: 15000,
      from: 'Алексей',
    },
    { id: 2, date: '19.04.2025', type: 'Halyk', amount: 8500, from: 'Мария' },
    {
      id: 3,
      date: '19.04.2025',
      type: 'Cash',
      amount: 25000,
      from: 'Закрытие смены',
    },
    {
      id: 4,
      date: '18.04.2025',
      type: 'Kaspi',
      amount: 12000,
      from: 'Дмитрий',
    },
    {
      id: 5,
      date: '18.04.2025',
      type: 'Cash',
      amount: 18000,
      from: 'Закрытие смены',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Summary Cards */}
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="text-sm opacity-80">Наличные</div>
              <Money className="text-2xl font-bold">
                {stats.data?.cash_total}
              </Money>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="text-sm opacity-80">Безналичные</div>
              <Money className="text-2xl font-bold">
                {stats.data?.bank_total}
              </Money>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Общая сумма</div>
                <Money className="text-3xl font-bold text-primary">
                  {stats.data?.total_amount}
                </Money>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-2 border-primary"
                  onClick={() =>
                    handleAddTransaction({ type: CashRegisterType.CASH })
                  }
                >
                  Наличные
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-primary"
                  onClick={() =>
                    handleAddTransaction({
                      type: CashRegisterType.BANK_TRANSFER,
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Перевод
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Breakdown */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">По банкам:</h3>
            <div className="space-y-2">
              {stats.data?.banks?.map((bank) => (
                <div
                  key={bank.bank_name}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>{bank.bank_name}</span>
                  </div>
                  <Money className="font-medium">{bank.amount}</Money>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex gap-2 mb-4">
          <SearchBar />

          <Button
            variant="outline"
            className="border-2 border-primary/30 aspect-square p-2"
          >
            <CalendarRange className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs and Transaction List */}
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="cash">Наличные</TabsTrigger>
            <TabsTrigger value="non-cash">Безнал</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TransactionList transactions={transactions} filter="all" />
          </TabsContent>

          <TabsContent value="cash">
            <TransactionList transactions={transactions} filter="cash" />
          </TabsContent>

          <TabsContent value="non-cash">
            <TransactionList transactions={transactions} filter="non-cash" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
