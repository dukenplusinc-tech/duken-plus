import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { updateSecuritySettings } from '@/lib/entities/users/actions/updateSecurity';
import { SecurityPayload, securityPayload } from '@/lib/entities/users/schema';

const defaultValues: SecurityPayload = {
  pin_code: '',
  password: '',
  password_confirm: '',
};

export function useSecuritySettingsForm() {
  const t = useTranslations('validation.success');

  return useForm<typeof securityPayload, SecurityPayload>({
    defaultValues,
    request: async (values) => {
      await updateSecuritySettings(values);
    },
    schema: securityPayload,
    successMessage: {
      title: t('security_settings_saved_title'),
      description: t('security_settings_saved_description'),
    },
  });
}
