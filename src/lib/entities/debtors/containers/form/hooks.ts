import { useRouter } from 'next/navigation';

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
  shop_id: '',
};

export function useDebtorForm(id?: string) {
  const router = useRouter();

  const fetcher = useDebtorById(id);

  const uploadCtx = useUploadContext();

  return useForm<typeof debtorPayloadSchema, DebtorPayload>({
    defaultValues,
    fetcher,
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
  });
}
