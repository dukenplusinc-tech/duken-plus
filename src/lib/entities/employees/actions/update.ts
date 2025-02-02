'use server';

import { CreateEmployee } from '@/lib/entities/employees/schema';
import { createClient } from '@/lib/supabase/server';

export async function updateEmployee(id: string, values: CreateEmployee) {
  const supabase = createClient();

  const response = await supabase
    .from('employees')
    .update({
      full_name: values.full_name,
      pin_code: values.pin_code,
    })
    .eq('id', id);

  if (response.error) {
    throw response.error;
  }

  return true;
}
