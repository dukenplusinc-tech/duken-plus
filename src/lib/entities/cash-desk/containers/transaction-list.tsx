import { MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Transaction {
  id: number;
  date: string;
  type: string;
  amount: number;
  from: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  filter: 'all' | 'cash' | 'non-cash';
}

export default function TransactionList({
  transactions,
  filter,
}: TransactionListProps) {
  // Filter transactions based on the selected tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    if (filter === 'cash') return transaction.type === 'Cash';
    if (filter === 'non-cash') return transaction.type !== 'Cash';

    return true;
  });

  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};

  filteredTransactions.forEach((transaction) => {
    if (!groupedTransactions[transaction.date]) {
      groupedTransactions[transaction.date] = [];
    }
    groupedTransactions[transaction.date].push(transaction);
  });

  return (
    <div className="space-y-4">
      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <div key={date}>
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {date}
          </div>
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex justify-between items-center p-3 rounded-md ${
                  transaction.type === 'Cash'
                    ? 'bg-primary/10'
                    : transaction.type === 'Kaspi'
                      ? 'bg-green-100'
                      : 'bg-blue-100'
                }`}
              >
                <div>
                  <div className="font-medium">{transaction.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.from}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-2">
                    {transaction.amount.toLocaleString()} тг
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Нет транзакций
        </div>
      )}
    </div>
  );
}
