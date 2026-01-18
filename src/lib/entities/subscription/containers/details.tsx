import { PhoneIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Shop } from '@/lib/entities/shop/schema';
import { SubscriptionInfo } from '@/lib/entities/subscription/hooks/useSubscriptionStatus';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PhoneLink } from '@/components/ui/phone-link';
import { useExternalLink } from '@/lib/hooks/use-external-link';

interface SubscriptionInfoProps {
  subscription: SubscriptionInfo;
  shop: Shop;
}

export function SubscriptionDisplayInfo({
  subscription,
  shop,
}: SubscriptionInfoProps) {
  const t = useTranslations('subscription');

  const phoneNumber = '+77072777075';
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\+/g, '')}`;
  const { handleClick: handleWhatsAppClick } = useExternalLink(whatsappLink);

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-1">
          <p className="text-center text-gray-500">{t('shop_label')}:</p>
          <p className="text-center text-xl font-bold">{shop.title}</p>
        </div>

        <div className="space-y-1">
          <p className="text-center text-gray-500">{t('id_label')}:</p>
          <p className="text-center text-xl font-bold">{shop.code}</p>
        </div>

        <div className="space-y-1">
          <p className="text-center text-gray-500">{t('paid_until')}:</p>
          <p className="text-center text-xl font-bold">
            {subscription.available_until
              ? new Date(subscription.available_until)
                  .toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\./g, '.')
              : '---'}
          </p>
        </div>

        {
          <div className="text-center">
            <Badge
              onClick={handleWhatsAppClick}
              className={cn(
                'text-white text-lg py-2 px-4 rounded-md cursor-pointer',
                subscription.daysRemaining > 1
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              )}
            >
              {subscription.isActive
                ? t('days_remaining', { days: subscription.daysRemaining })
                : t('pay_for_subscription')}
            </Badge>
          </div>
        }

        <div className="space-y-1">
          <p className="text-center text-gray-500">{t('last_payment')}:</p>
          <p className="text-center">
            {subscription.date
              ? new Date(subscription.date)
                  .toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\./g, '.')
              : '---'}{' '}
            {subscription.payment_method && (
              <span>
                {t('via_label')} {subscription.payment_method}
              </span>
            )}
          </p>
        </div>

        <div className="pt-4 border-t">
          <p className="text-center font-medium text-lg mb-4">
            {t('sub_for_1_month_label')}:
          </p>

          <div className="space-y-4">
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <p className="text-center font-bold mb-2">
                {t('manual_payment_label')}:
              </p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <PhoneLink
                  phoneNumber={phoneNumber}
                  className="font-medium hover:underline"
                  showIcon={false}
                >
                  <PhoneIcon className="h-5 w-5 inline-block mr-2" />
                  {phoneNumber}
                </PhoneLink>
              </div>
              <div className="text-center">
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#25D366"
                    stroke="none"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
