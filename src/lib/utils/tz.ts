import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import type { Locale } from 'date-fns';

export const APP_TIMEZONE = 'Asia/Almaty';

/** Format a date for user display, always in Almaty timezone */
export function formatTZ(
  date: Date | string | number,
  fmt: string,
  options?: { locale?: Locale }
): string {
  return formatInTimeZone(new Date(date), APP_TIMEZONE, fmt, options);
}

/** Today as YYYY-MM-DD in Almaty timezone */
export function todayInTZ(): string {
  return formatInTimeZone(new Date(), APP_TIMEZONE, 'yyyy-MM-dd');
}

/** Convert a Date to YYYY-MM-DD in Almaty timezone (for DB date comparisons) */
export function toDateStringTZ(date: Date): string {
  return formatInTimeZone(date, APP_TIMEZONE, 'yyyy-MM-dd');
}

/**
 * Start of a calendar day in Almaty timezone as UTC ISO string.
 * Uses the local date parts (year/month/day) as the Almaty calendar date,
 * so this works correctly regardless of the device's timezone.
 */
export function startOfDayTZ(date: Date): string {
  return fromZonedTime(
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    APP_TIMEZONE
  ).toISOString();
}

/**
 * End of a calendar day in Almaty timezone as UTC ISO string.
 * Uses the local date parts (year/month/day) as the Almaty calendar date.
 */
export function endOfDayTZ(date: Date): string {
  return fromZonedTime(
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
    APP_TIMEZONE
  ).toISOString();
}
