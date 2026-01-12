'use client';

import { FC } from 'react';
import Image from 'next/image';
import { IonSpinner } from '@ionic/react';
import { User, LoaderCircle as Spinner } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useDebtorsByIin } from '@/lib/entities/debtors/hooks/useDebtorsByIin';
import { useEntityImage } from '@/lib/composite/files/hooks/useEntityImage';
import { useImageViewer } from '@/lib/composite/image/viewer/context';
import { UploadEntities } from '@/lib/composite/uploads/types';
import { Separator } from '@/components/ui/separator';

interface NameVariationsModalProps {
  iin: string;
}

interface DebtorVariationPhotoProps {
  debtorId: string;
  debtorName: string;
}

const DebtorVariationPhoto: FC<DebtorVariationPhotoProps> = ({ debtorId, debtorName }) => {
  const imageViewer = useImageViewer();
  const { imageUrl, loading } = useEntityImage({
    id: debtorId,
    entity: UploadEntities.DebtorPhoto,
  });

  const handleImageClick = () => {
    if (imageUrl) {
      imageViewer.openViewer(imageUrl);
    }
  };

  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted/60 flex-shrink-0">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : imageUrl ? (
        <div
          className="cursor-pointer hover:opacity-80 transition-opacity h-full w-full"
          onClick={handleImageClick}
        >
          <Image
            src={imageUrl}
            alt={debtorName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 128px"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-background/60">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export const NameVariationsModal: FC<NameVariationsModalProps> = ({ iin }) => {
  const t = useTranslations('debtors');
  const { data, error, isLoading } = useDebtorsByIin(iin);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <IonSpinner name="dots" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        {t('black_list.name_variations.error', { defaultValue: 'Error loading name variations' })}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">
        {t('black_list.name_variations.empty', { defaultValue: 'No debtors found' })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-mono text-muted-foreground">{iin}</p>
        <Separator />
      </div>

      <div className="space-y-4">
        {data.map((debtor, index) => (
          <div key={`${debtor.id}-${index}`}>
            <div className="flex gap-4 items-start">
              {/* Photo */}
              <DebtorVariationPhoto debtorId={debtor.id} debtorName={debtor.full_name} />

              {/* Name and Shop Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground mb-1">{debtor.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {t('black_list.name_variations.shop_label', { defaultValue: 'Shop' })}: {debtor.shop_title}
                </p>
              </div>
            </div>
            {index < data.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
};
