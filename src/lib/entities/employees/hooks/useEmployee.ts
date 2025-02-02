import {
  CreateEmployee,
  createEmployeeSchema as schema,
} from '@/lib/entities/employees/schema';
import { useQueryById } from '@/lib/supabase/useQueryById';

export const useEmployee = (id: string | null = null) => {
  return useQueryById<CreateEmployee>(
    id,
    'employees',
    `
      full_name,
      pin_code
    `,
    {
      schema,
    }
  );
};
