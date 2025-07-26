'use client';

import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Building,
  ShoppingCart,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useStats } from '@/lib/entities/statistics/hooks/useStats';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page/header';
import { Money } from '@/components/numbers/money';

export function StatsPage() {
  const t = useTranslations('statistics');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>(
    'month'
  );
  const { stats, isLoading } = useStats(period);

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="mb-4">{t('title')}</PageHeader>
      <div className="py-2">
        <h1 className="text-2xl font-bold text-primary mb-4 mt-2">
          {t('heading')}
        </h1>

        {/* Period Selector */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              className={`py-2 px-4 rounded-md ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-primary'
              }`}
              onClick={() => setPeriod(p)}
            >
              {t(`period.${p}`)}
            </button>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="bg-white border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('summary.loaned_out')}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {isLoading ? '...' : <Money>{stats?.loanedOut ?? 0}</Money>}
                  </p>
                </div>
                <div className="bg-success/10 p-2 rounded-full">
                  <ArrowUpRight className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('summary.repaid')}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {isLoading ? '...' : <Money>{stats?.repaid ?? 0}</Money>}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <ArrowDownRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('summary.to_firms')}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {isLoading ? '...' : <Money>{stats?.toFirms ?? 0}</Money>}
                  </p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-full">
                  <Building className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('summary.cash_registers')}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {isLoading ? '...' : (stats?.cashRegisters ?? 0)}
                  </p>
                </div>
                <div className="bg-purple-500/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
