export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDayLabel(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatWeekday(value: string): string {
  const date = new Date(value);
  const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  return weekdays[date.getDay()];
}

export function formatConsignmentDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getDaysLate(selectedDay: string, dueISO: string | null): number | null {
  if (!selectedDay || !dueISO) return null;
  const selected = new Date(selectedDay);
  const due = new Date(dueISO);
  const diff = Math.floor(
    (selected.setHours(0, 0, 0, 0) - due.setHours(0, 0, 0, 0)) / 86_400_000
  );
  return diff < 0 ? 0 : diff;
}

export function getMonthRange(anchor: Date) {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const endExclusive = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);

  return {
    from: toISODate(start),
    to: toISODate(new Date(endExclusive.getTime() - 1)),
    toExclusive: toISODate(endExclusive),
  };
}



