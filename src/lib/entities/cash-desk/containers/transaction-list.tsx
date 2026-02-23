import { formatTZ } from '@/lib/utils/tz';
import { useTranslations } from 'next-intl';

import type { CashRegister as Transaction } from '@/lib/entities/cash-desk/schema';
import { Badge } from '@/components/ui/badge';
import { Money } from '@/components/numbers/money';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const t = useTranslations('cash_desk.transactions');

  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};

  transactions.forEach((transaction) => {
    const date = transaction.date
      ? formatTZ(transaction.date, 'dd.MM.yyyy')
      : '---';

    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
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
                  transaction.type === 'cash'
                    ? 'bg-primary/10'
                    : transaction.type === 'bank_transfer'
                      ? 'bg-green-100'
                      : 'bg-blue-100'
                }`}
              >
                <div>
                  <div className="font-medium">{transaction.from}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('added_by')}:{' '}
                    <span className="font-bold">{transaction.added_by}</span>
                    {transaction.date && (
                      <>
                        {' • '}
                        {formatTZ(transaction.date, 'HH:mm')}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {transaction.bank_name && (
                    <Badge variant="secondary" className="mr-2">
                      {transaction.bank_name}
                    </Badge>
                  )}
                  <Money fullAmount className="font-bold mr-2">
                    {transaction.amount}
                  </Money>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {transactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t('empty_list')}
        </div>
      )}
    </div>
  );
}
