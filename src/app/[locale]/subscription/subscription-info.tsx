'use client';

import Link from 'next/link';
import { HistoryIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { SubscriptionDisplayInfo } from '@/lib/entities/subscription/containers/details';
import { useSubscriptionStatus } from '@/lib/entities/subscription/hooks/useSubscriptionStatus';
import * as fromUrl from '@/lib/url/generator';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page/header';
import { ErrorScreen } from '@/components/ui/page/screen/error';

export function SubscriptionInfo() {
  const shop = useShop();
  const subscription = useSubscriptionStatus(shop?.data?.id);

  const error = shop?.error || subscription.error;

  const t = useTranslations('subscription');

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        className="mb-4"
        right={
          <Link href={fromUrl.toSubscriptionTransactions()}>
            <Button variant="success" size="icon" className="h-[38px] w-[38px]">
              <HistoryIcon />
            </Button>
          </Link>
        }
      >
        {t('title')}
      </PageHeader>

      {error && <ErrorScreen error={error} />}

      {shop?.data && subscription?.subscription && (
        <SubscriptionDisplayInfo
          subscription={subscription?.subscription}
          shop={shop?.data}
        />
      )}
    </div>
  );
}
