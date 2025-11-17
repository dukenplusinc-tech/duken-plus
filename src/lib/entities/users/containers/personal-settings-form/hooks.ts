import { useTranslations } from 'next-intl';

import { Locale } from '@/config/languages';
import { useForm } from '@/lib/composite/form/useForm';
import { updatePersonal } from '@/lib/entities/users/actions/updatePersonal';
import { usePersonalData } from '@/lib/entities/users/hooks/usePersonalData';
import { useUserId } from '@/lib/entities/users/hooks/useUser';
import { PersonalPayload, personalPayload } from '@/lib/entities/users/schema';
import { useChangeLocale } from '@/lib/i18n';

const defaultValues: PersonalPayload = {
  full_name: '',
  email: '',
  phone: '',
  language: '',
};

export function usePersonalForm() {
  const t = useTranslations('validation.success');
  const uid = useUserId();

  const changeLocale = useChangeLocale();

  return useForm<typeof personalPayload, PersonalPayload>({
    defaultValues,
    fetcher: usePersonalData(),
    request: async (values) => {
      await updatePersonal(uid!, values);

      changeLocale(values.language as Locale);
    },
    schema: personalPayload,
    successMessage: {
      title: t('personal_settings_saved_title'),
      description: t('personal_settings_saved_description'),
    },
  });
}
