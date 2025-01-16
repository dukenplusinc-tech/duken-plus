export function simplifyNumber(value: number): string {
  if (typeof window === 'undefined') {
    return value.toString();
  }

  const formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return formatter.format(value);
}
