import { format } from 'date-fns';

export function toSupabaseDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
