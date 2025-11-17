import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { useUploadContext } from '@/lib/composite/uploads/manager';
import { createContractor } from '@/lib/entities/contractors/actions/createContractor';
import { updateContractor } from '@/lib/entities/contractors/actions/updateContractor';
import { useContractorById } from '@/lib/entities/contractors/hooks/useContractorById';
import {
  ContractorPayload,
  contractorPayloadSchema,
} from '@/lib/entities/contractors/schema';
import * as fromUrl from '@/lib/url/generator';

const defaultValues: ContractorPayload = {
  title: '',
  supervisor: '',
  supervisor_phone: '',
  sales_representative: '',
  sales_representative_phone: '',
  address: '',
  note: '',
};

export function useContractorForm(id?: string) {
  const router = useRouter();
  const t = useTranslations('validation.success');

  const fetcher = useContractorById(id);

  const uploadCtx = useUploadContext();

  return useForm<typeof contractorPayloadSchema, ContractorPayload>({
    defaultValues,
    fetcher,
    request: async (values) => {
      let uploadID = id;

      if (id) {
        await updateContractor(id, values);
      } else {
        uploadID = await createContractor(values);
      }

      if (uploadID) {
        await uploadCtx.startUpload({ uploadID });
      }

      router.push(fromUrl.toContractors());
    },
    schema: contractorPayloadSchema,
    successMessage: {
      title: id ? t('saved_title') : t('added_title'),
      description: id ? t('saved_description') : t('added_description'),
    },
  });
}
