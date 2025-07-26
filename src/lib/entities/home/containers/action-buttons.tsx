'use client';

import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAddDeliveryReqLauncher } from '@/lib/entities/deliveries/containers/add-delivery-form';
import { useExpenseFormLauncher } from '@/lib/entities/expenses/containers/add-expense-form';
import { fromUrl } from '@/lib/url';
import { Button } from '@/components/ui/button';

export default function ActionButtons() {
  const t = useTranslations('home.actions');
  const expenseFormLauncher = useExpenseFormLauncher();
  const addDeliveryReqLauncher = useAddDeliveryReqLauncher();

  return (
    <div className="px-2 mt-4 space-y-2">
      <Button
        className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto"
        onClick={addDeliveryReqLauncher}
      >
        <Plus size={28} className="mr-3" />
        <span className="text-lg">{t('add_firm')}</span>
      </Button>

      <Button
        className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto"
        onClick={expenseFormLauncher}
      >
        <Plus size={28} className="mr-3" />
        <span className="text-lg">{t('add_expense')}</span>
      </Button>

      <Link href={fromUrl.toCalendar()} className="block">
        <Button className="w-full bg-success text-success-foreground py-6 rounded-md flex items-center justify-center h-auto">
          <Calendar size={28} className="mr-3" />
          <span className="text-lg">{t('calendar')}</span>
        </Button>
      </Link>
    </div>
  );
}
