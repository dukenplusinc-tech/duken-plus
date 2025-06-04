import Link from 'next/link';
import { LoaderCircle as Spinner, User } from 'lucide-react';

import { useEntityImage } from '@/lib/composite/files/hooks/useEntityImage';
import { UploadEntities } from '@/lib/composite/uploads/types';
import type { Debtor } from '@/lib/entities/debtors/schema';
import * as fromUrl from '@/lib/url/generator';
import { useShopID } from '@/lib/entities/shop/hooks/useShop';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DebtorCardProps {
  debtor: Debtor;
}

export function DebtorCard({ debtor }: DebtorCardProps) {
  const { id, iin, full_name, shop_id } = debtor;

  const currentShopId = useShopID();
  const allowEdit = currentShopId === shop_id;

  const { imageUrl, loading } = useEntityImage({
    id,
    entity: UploadEntities.DebtorPhoto,
  });

  const card = (
    <div className="flex flex-col items-center p-4 border-2 border-primary rounded-md aspect-[1/1.2] max-w-[250px]">
        <div className="w-24 h-24 mb-4">
          <Avatar className="w-full h-full border-2 border-primary rounded-md">
            {loading ? (
              <div className="flex justify-center items-center w-full">
                <Spinner className="w-14 h-14 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <AvatarImage
                  src={imageUrl!}
                  alt={full_name}
                  className="object-cover rounded-md"
                />
                <AvatarFallback className="rounded-md bg-white">
                  <User className="w-14 h-14 text-primary" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
        <div className="text-center">
          <p className="font-medium text-lg text-primary mb-1">{full_name}</p>
          <p className="text-primary text-md">{iin}</p>
        </div>
      </div>
  );

  return allowEdit ? (
    <Link href={fromUrl.toDebtorEdit(debtor.id)}>{card}</Link>
  ) : (
    card
  );
}
