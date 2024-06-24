import { useForm } from '@/lib/composite/form/useForm';
import { updateShop } from '@/lib/entities/shop/actions/update';
import { usePersonalData } from '@/lib/entities/users/hooks/usePersonalData';
import { PersonalPayload, personalPayload } from '@/lib/entities/users/schema';

const defaultValues: PersonalPayload = {
  full_name: '',
  email: '',
  phone: '',
  language: '',
};

export function usePersonalForm() {
  return useForm<typeof personalPayload, PersonalPayload>({
    defaultValues,
    fetcher: usePersonalData(),
    request: async (values) => {
      // await updateShop(values);
    },
    schema: personalPayload,
  });
}
