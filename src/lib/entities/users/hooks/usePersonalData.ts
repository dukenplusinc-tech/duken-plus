'use client';

import { useUser } from '@/lib/entities/users/hooks/useUser';
import {
  PersonalPayload,
  personalPayload as schema,
} from '@/lib/entities/users/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const usePersonalData = () => {
  const user = useUser();

  return useQueryById<PersonalPayload>(
    user?.id!,
    'extended_profile',
    `
      full_name,
      language,
      email,
      phone
      `,
    {
      schema,
    }
  );
};
