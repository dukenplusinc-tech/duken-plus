import { useForm } from '@/lib/composite/form/useForm';
import { inviteUser } from '@/lib/entities/users/actions/inviteUser';
import { InviteUser, inviteUserSchema } from '@/lib/entities/users/schema';

export function useUserForm(id?: string) {
  return useForm<typeof inviteUserSchema, InviteUser, boolean>({
    defaultValues: {
      email: 'jepise4633@morxin.com',
      full_name: 'John Doe',
      role_id: '2',
    },
    request: async (values) => {
      if (id) {
        // todo: update user info
      } else {
        await inviteUser(values);
      }
    },
    schema: inviteUserSchema,
  });
}
