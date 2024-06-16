import { useForm } from '@/lib/composite/form/useForm';
import { inviteUser } from '@/lib/entities/users/actions/inviteUser';
import { InviteUser, inviteUserSchema } from '@/lib/entities/users/schema';
import * as fromUrl from '@/lib/url/generator';

export function useUserForm(id?: string) {
  return useForm<typeof inviteUserSchema, InviteUser, boolean>({
    defaultValues: {
      email: '',
      full_name: '',
      role_id: '',
    },
    request: async (values) => {
      if (id) {
        // todo: update user info
      } else {
        await inviteUser(values, fromUrl.fullUrl(fromUrl.toInvited()));
      }
    },
    schema: inviteUserSchema,
  });
}
