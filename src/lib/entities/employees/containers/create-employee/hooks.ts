import { useRouter } from 'next/navigation';

import { useForm } from '@/lib/composite/form/useForm';
import { createEmployee } from '@/lib/entities/employees/actions/create';
import { updateEmployee } from '@/lib/entities/employees/actions/update';
import { useEmployee } from '@/lib/entities/employees/hooks/useEmployee';
import {
  CreateEmployee,
  createEmployeeSchema,
} from '@/lib/entities/employees/schema';
import * as fromUrl from '@/lib/url/generator';

export function useEmployeeForm(id: string | null) {
  const router = useRouter();

  const employee = useEmployee(id);

  return useForm<typeof createEmployeeSchema, CreateEmployee>({
    defaultValues: {
      full_name: '',
      pin_code: '',
    },
    fetcher: employee,
    request: async (values) => {
      if (id) {
        await updateEmployee(id, values);
      } else {
        await createEmployee(values);
      }

      router.push(fromUrl.toEmployees());
    },
    schema: createEmployeeSchema,
  });
}
