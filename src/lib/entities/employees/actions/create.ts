'use server';

import { CreateEmployee } from '@/lib/entities/employees/schema';
import { getShopId } from '@/lib/entities/shop/actions/getShopId';
import { createClient } from '@/lib/supabase/server';

export async function createEmployee(values: CreateEmployee) {
  const supabase = createClient();

  const response = await supabase.from('employees').insert({
    full_name: values.full_name,
    pin_code: values.pin_code,
    shop_id: await getShopId(),
  });

  if (response.error) {
    throw response.error;
  }

  return true;
}
