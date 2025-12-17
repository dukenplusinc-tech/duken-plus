'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ShiftCountdownProps {
  closesAt: string;
}

export function ShiftCountdown({ closesAt }: ShiftCountdownProps) {
  const t = useTranslations('cash_desk.shifts');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const closeTime = new Date(closesAt).getTime();
      const difference = closeTime - now;

      if (difference <= 0) {
        setTimeRemaining('0 ч. 0 мин.');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${hours} ч. ${minutes} мин.`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [closesAt]);

  return (
    <span className="text-sm text-muted-foreground">
      ({t('until_closing', { time: timeRemaining })})
    </span>
  );
}





