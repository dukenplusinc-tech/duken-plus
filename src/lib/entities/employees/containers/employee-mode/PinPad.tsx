import { FC } from 'react';
import { Delete } from 'lucide-react';

import { PinButton } from './PinButton';

interface PinPadProps {
  onPinInput: (digit: string) => void;
  onDelete: () => void;
}

export const PinPad: FC<PinPadProps> = ({ onPinInput, onDelete }) => {
  const digits = [...Array(9)].map((_, i) => (i + 1).toString());
  return (
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      {digits.map((digit) => (
        <PinButton
          key={digit}
          digit={digit}
          onClick={() => onPinInput(digit)}
        />
      ))}
      <div className="col-start-2">
        <PinButton digit="0" onClick={() => onPinInput('0')} />
      </div>
      <button
        onClick={onDelete}
        className="col-start-3 w-20 h-20 rounded-full bg-secondary/50 hover:bg-secondary/80 flex items-center justify-center transition-all duration-200 active:scale-95"
      >
        <Delete className="h-6 w-6" />
      </button>
    </div>
  );
};
