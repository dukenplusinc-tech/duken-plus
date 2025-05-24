import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTotalExpenses } from '@/lib/entities/expenses/hooks/useTotalExpenses';
import { Card, CardContent } from '@/components/ui/card';

export default function ExpenseSummary() {
  const t = useTranslations('expenses');

  const { totalTomorrow, totalYesterday, loading } = useTotalExpenses();

  return (
    <div className="grid grid-cols-2 gap-2 px-2 mt-4">
      <Card className="bg-primary text-primary-foreground border-0">
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
              `${totalYesterday} тг`
            )}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-primary text-primary-foreground border-0">
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
              `${totalTomorrow} тг`
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
