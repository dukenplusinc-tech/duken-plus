import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { updateShop } from '@/lib/entities/shop/actions/update';
import { useShop } from '@/lib/entities/shop/hooks/useShop';
import { ShopPayload, shopPayloadSchema } from '@/lib/entities/shop/schema';

const defaultValues = {
  id: '',
  title: '',
  address: '',
  city: '',
};

export function useShopForm() {
  const t = useTranslations('validation.success');

  return useForm<typeof shopPayloadSchema, ShopPayload>({
    defaultValues,
    fetcher: useShop(),
    request: async (values) => {
      await updateShop(values);
    },
    schema: shopPayloadSchema,
    successMessage: {
      title: t('shop_saved_title'),
      description: t('shop_saved_description'),
    },
  });
}
