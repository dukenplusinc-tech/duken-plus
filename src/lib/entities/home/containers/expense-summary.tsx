import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useExpenseInfoDialog } from '@/lib/entities/expenses/hooks/useExpenseInfoDialog';
import { useTotalExpenses } from '@/lib/entities/expenses/hooks/useTotalExpenses';
import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/numbers/money';

export default function ExpenseSummary() {
  const t = useTranslations('expenses');

  const { totalTomorrow, totalYesterday, loading } = useTotalExpenses();

  const infoDialog = useExpenseInfoDialog();

  return (
    <div className="grid grid-cols-2 gap-2 px-2 mt-4">
      <Card
        className="bg-primary text-primary-foreground border-0"
        onClick={infoDialog.openYesterday}
      >
        <CardContent className="p-4">
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{
              __html: t('summary.yesterday_label'),
            }}
          />
          <p className="text-2xl font-bold">
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Money>{totalYesterday}</Money>
            )}
          </p>
        </CardContent>
      </Card>
      <Card
        className="bg-primary text-primary-foreground border-0"
        onClick={infoDialog.openTomorrow}
      >
        <CardContent className="p-4">
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{
              __html: t('summary.tomorrow_label'),
            }}
          />
          <p className="text-2xl font-bold">
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Money>{totalTomorrow}</Money>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
