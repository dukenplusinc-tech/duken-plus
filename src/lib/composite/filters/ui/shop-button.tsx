import { FC } from 'react';
import { MapPinIcon } from 'lucide-react';

import { useShop } from '@/lib/entities/shop/hooks/useShop';

export const ShopButton: FC = () => {
  const { data } = useShop();

  if (!data?.title) {
    return null;
  }

  return (
    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow bg-primary hover:bg-primary/90 h-[38px] w-auto px-2">
      <MapPinIcon className="h-5 w-5 mr-1" /> {data.city}
    </div>
  );
};
