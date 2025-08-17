// helper: local YYYY-MM-DD
export function ymdLocal(y: number, m: number, d: number) {
  const mm = String(m + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

export function todayISO(): string {
  const [dateValue] = new Date().toISOString().split('T');

  return dateValue;
}
