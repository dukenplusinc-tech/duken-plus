import { FC } from 'react';

interface PinButtonProps {
  digit: string;
  onClick: () => void;
}

export const PinButton: FC<PinButtonProps> = ({ digit, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-20 h-20 rounded-full bg-secondary/50 hover:bg-secondary/80 flex items-center justify-center text-2xl font-semibold transition-all duration-200 active:scale-95"
    >
      {digit}
    </button>
  );
};
