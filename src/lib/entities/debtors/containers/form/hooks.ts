import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { useUploadContext } from '@/lib/composite/uploads/manager';
import { createDebtor } from '@/lib/entities/debtors/actions/createDebtor';
import { updateDebtor } from '@/lib/entities/debtors/actions/updateDebtor';
import { useDebtorById } from '@/lib/entities/debtors/hooks/useDebtorById';
import {
  DebtorPayload,
  debtorPayloadSchema,
} from '@/lib/entities/debtors/schema';
import * as fromUrl from '@/lib/url/generator';

const defaultValues: DebtorPayload = {
  full_name: '',
  address: '',
  iin: '',
  phone: '',
  additional_info: '',
  work_place: '',
  max_credit_amount: 0,
  balance: 0,
  shop_id: '',
};

export function useDebtorForm(id?: string) {
  const router = useRouter();
  const t = useTranslations('validation.success');

  const fetcher = useDebtorById(id);

  const uploadCtx = useUploadContext();

  return useForm<typeof debtorPayloadSchema, DebtorPayload>({
    defaultValues,
    fetcher,
    setDefaultValues: (key: string, value: any, setValue: (key: string, value: any) => void) => {
      // Convert numeric fields to numbers
      if (key === 'balance' || key === 'max_credit_amount') {
        const numValue =
          value === null || value === undefined || value === ''
            ? 0
            : typeof value === 'string'
              ? parseFloat(value) || 0
              : typeof value === 'number'
                ? value
                : 0;
        setValue(key, numValue);
      } else {
        // For other fields, preserve the value (including null/undefined)
        setValue(key, value === null || value === undefined ? '' : value);
      }
    },
    request: async (values) => {
      let uploadID = id;

      if (id) {
        await updateDebtor(id, values);
      } else {
        uploadID = await createDebtor(values);
      }

      if (uploadID) {
        await uploadCtx.startUpload({ uploadID });
      }

      router.push(fromUrl.toDebtors());
    },
    schema: debtorPayloadSchema,
    successMessage: {
      title: id ? t('saved_title') : t('added_title'),
      description: id ? t('saved_description') : t('added_description'),
    },
  });
}
