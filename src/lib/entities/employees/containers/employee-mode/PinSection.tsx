import { FC, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PinDisplay } from './PinDisplay';
import { PinPad } from './PinPad';

interface PinSectionProps {
  pin: string[];
  onPinInput: (digit: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PinSection: FC<PinSectionProps> = ({
  pin,
  onPinInput,
  onDelete,
  onSubmit,
  isLoading,
}) => {
  const t = useTranslations('employees');

  useEffect(() => {
    if (!isLoading && !pin.includes('') && onSubmit) {
      onSubmit();
    }
  }, [isLoading, onSubmit, pin]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-center">
        <Lock className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">
          {t('login.enter_pin_label')}
        </span>
      </div>
      <PinDisplay pin={pin} />
      <PinPad onPinInput={onPinInput} onDelete={onDelete} />
    </div>
  );
};
