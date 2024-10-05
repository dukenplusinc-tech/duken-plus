'use client';

import type { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { IonLoading } from '@ionic/react';
import type { PostgrestError } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';

import * as fromUrl from '@/lib/url/generator';

interface Props extends PropsWithChildren {
  loading?: boolean;
  error?: PostgrestError | string | null;
  canDismiss?: boolean;
  dismissURL?: string | null;
}

export const EntityLoader: FC<Props> = ({
  children,
  loading,
  error,
  canDismiss = false,
  dismissURL = null,
}) => {
  const t = useTranslations('loader');

  const router = useRouter();

  function handleDismiss() {
    if (canDismiss) {
      router.push(dismissURL || fromUrl.toHome());
    }
  }

  if (loading) {
    return (
      <IonLoading
        isOpen={true}
        message={t('message')}
        backdropDismiss={canDismiss}
        onDidDismiss={handleDismiss}
      />
    );
  }

  if (error) {
    return <div>{t('error')}</div>;
  }

  return children;
};
