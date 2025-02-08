import { useForm } from '@/lib/composite/form/useForm';
import { updateSecuritySettings } from '@/lib/entities/users/actions/updateSecurity';
import { SecurityPayload, securityPayload } from '@/lib/entities/users/schema';

const defaultValues: SecurityPayload = {
  pin_code: '',
  password: '',
  password_confirm: '',
};

export function useSecuritySettingsForm() {
  return useForm<typeof securityPayload, SecurityPayload>({
    defaultValues,
    request: async (values) => {
      await updateSecuritySettings(values);
    },
    schema: securityPayload,
  });
}
