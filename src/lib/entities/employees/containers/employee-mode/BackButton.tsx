import { FC } from 'react';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute left-4 top-4"
      onClick={onClick}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
};
