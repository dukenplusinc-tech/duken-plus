'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MoneyProps {
  children: number | null | undefined;
  className?: string;
  emptyLabel?: string;
}

const formatMoney = (amount: number): string => {
  if (amount == null || isNaN(amount)) {
    return '---';
  }

  const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(numAmount)) {
    return '---';
  }

  if (numAmount >= 1000000) {
    return `${(numAmount / 1000000).toFixed(1)}M`;
  }
  if (numAmount >= 1000) {
    return `${(numAmount / 1000).toFixed(1)}K`;
  }
  return numAmount.toFixed(2);
};

const formatFullAmount = (amount: number): string => {
  return new Intl.NumberFormat('kk-KZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function Money({ children, emptyLabel, className }: MoneyProps) {
  const { toast } = useToast();
  const t = useTranslations('money');

  const handleClick = () => {
    if (children == null || isNaN(Number(children))) {
      return;
    }

    const numAmount = typeof children === 'number' ? children : parseFloat(String(children));
    if (isNaN(numAmount)) {
      return;
    }

    toast({
      title: t('toast_title'),
      description: `${formatFullAmount(numAmount)} ₸`,
      duration: 3000,
    });
  };

  if (children == null || isNaN(Number(children))) {
    return <span>{emptyLabel || '---'}</span>;
  }

  const numAmount = typeof children === 'number' ? children : parseFloat(String(children));
  if (isNaN(numAmount)) {
    return <span>{emptyLabel || '---'}</span>;
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        className,
        'font-semibold text-left transition-all duration-200 hover:scale-105 active:scale-95'
      )}
    >
      {formatMoney(numAmount)} ₸
    </button>
  );
}
