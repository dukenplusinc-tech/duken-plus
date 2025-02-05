import { FC } from 'react';

import { cn } from '@/lib/utils';

interface PinDisplayProps {
  pin: string[];
}

export const PinDisplay: FC<PinDisplayProps> = ({ pin }) => {
  return (
    <div className="flex justify-center gap-3">
      {pin.map((digit, index) => (
        <div
          key={index}
          className={cn(
            'w-4 h-4 rounded-full transition-all duration-200',
            digit ? 'bg-primary scale-110' : 'bg-secondary'
          )}
        />
      ))}
    </div>
  );
};
