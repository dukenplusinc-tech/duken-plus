import { useForm } from '@/lib/composite/form/useForm';
import { updatePersonal } from '@/lib/entities/users/actions/updatePersonal';
import { usePersonalData } from '@/lib/entities/users/hooks/usePersonalData';
import { useUserId } from '@/lib/entities/users/hooks/useUser';
import { PersonalPayload, personalPayload } from '@/lib/entities/users/schema';

const defaultValues: PersonalPayload = {
  full_name: '',
  email: '',
  phone: '',
  language: '',
};

export function usePersonalForm() {
  const uid = useUserId();

  return useForm<typeof personalPayload, PersonalPayload>({
    defaultValues,
    fetcher: usePersonalData(),
    request: async (values) => {
      await updatePersonal(uid!, values);
    },
    schema: personalPayload,
  });
}
