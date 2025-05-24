'use client';

import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MoneyProps {
  children: number | null | undefined;
  className?: string;
}

const formatMoney = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toFixed(2);
};

const formatFullAmount = (amount: number): string => {
  return new Intl.NumberFormat('kk-KZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function Money({ children, className }: MoneyProps) {
  const { toast } = useToast();

  const handleClick = () => {
    if (!children) {
      return;
    }

    toast({
      title: 'Полная сумма',
      description: `${formatFullAmount(children)} тг`,
      duration: 3000,
    });
  };

  if (!children) {
    return <span>---</span>;
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        className,
        'font-semibold text-left transition-all duration-200 hover:scale-105 active:scale-95'
      )}
    >
      {formatMoney(children)} тг
    </button>
  );
}
