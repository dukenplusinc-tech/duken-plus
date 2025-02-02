import { useRouter } from 'next/navigation';

import { useForm } from '@/lib/composite/form/useForm';
import { inviteUser } from '@/lib/entities/users/actions/inviteUser';
import { InviteUser, inviteUserSchema } from '@/lib/entities/users/schema';
import * as fromUrl from '@/lib/url/generator';

export function useUserForm(id?: string) {
  const router = useRouter();

  return useForm<typeof inviteUserSchema, InviteUser>({
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

        router.push(fromUrl.toUsers());
      }
    },
    schema: inviteUserSchema,
  });
}
