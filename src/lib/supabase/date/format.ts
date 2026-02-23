import { toDateStringTZ } from '@/lib/utils/tz';

export function toSupabaseDateString(date: Date): string {
  return toDateStringTZ(date);
}
