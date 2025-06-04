'use client';

import { Plus } from 'lucide-react';

import { SearchBar } from '@/lib/composite/filters/ui/search-bar';
import { useAddCashRegisterEntryForm } from '@/lib/entities/cash-desk/containers/add-cash-register-entry';
import { CashEntriesTabs } from '@/lib/entities/cash-desk/containers/cash-entries-tabs';
import { useCashDeskStat } from '@/lib/entities/cash-desk/hooks/useCashDeskStat';
import { CashRegisterType } from '@/lib/entities/cash-desk/schema';
import { Button } from '@/components/ui/button';
import { DateFilterButton } from '@/lib/composite/filters/ui/date-filter-button';
import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/numbers/money';

export default function CashRegisterPage() {
  const stats = useCashDeskStat();
  const handleAddTransaction = useAddCashRegisterEntryForm();

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
              {stats.data?.banks
                ?.filter(({ bank_name }) => bank_name)
                ?.map((bank) => (
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
          <SearchBar searchByField="from" sortBy="date" />
          <DateFilterButton />
        </div>

        <CashEntriesTabs />
      </div>
    </main>
  );
}
