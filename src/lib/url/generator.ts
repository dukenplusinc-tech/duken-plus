export function toHome(): string {
  return `/`;
}

export function toInit(): string {
  return `/init`;
}

export function toSettings(): string {
  return `/settings`;
}

export function toUsers(): string {
  return `/users`;
}

export function toEmployees(): string {
  return `/employees`;
}

export function toEmployeeCreate(): string {
  return `/employees/create`;
}

export function toEmployeeLogs(id: string): string {
  return `/employees/logs/${id}`;
}

export function toEmployeeEdit(id: string): string {
  return `/employees/${id}`;
}

export function toInvite(): string {
  return `/users/invite`;
}

export function toUser(id: string): string {
  return `/users/${id}`;
}

export function toContractors(): string {
  return `/contractors`;
}

export function toDeliveries(): string {
  return `/contractors/deliveries`;
}

export function toConsignement(): string {
  return `/contractors/consignement`;
}

export function toAddContractor(): string {
  return `/contractors/create`;
}

export function toContractorEdit(id: string): string {
  return `/contractors/${id}`;
}

export function toDebtors(): string {
  return `/debtors`;
}

export function toDebtorHistory(id?: string): string {
  const qs = id ? `?debtor_id=${id}` : '';

  return `/debtors/history${qs}`;
}

export function toAddDebtor(): string {
  return `/debtors/create`;
}

export function toDebtorEdit(id: string): string {
  return `/debtors/${id}`;
}

export function toBlacklist(): string {
  return `/debtors/blacklist`;
}

export function toCashDesk(): string {
  return `/cash-desk`;
}

export function toShiftDetail(shiftId: string): string {
  return `/cash-desk/shifts/${shiftId}`;
}

export function toNotes(): string {
  return `/notes`;
}

export function toAddNote(): string {
  return `/notes/create`;
}

export function toNoteEdit(id: string): string {
  return `/notes/${id}`;
}

export function toNoteDetails(id: string): string {
  return `/notes/${id}/view`;
}

export function toChat(): string {
  return `/chat`;
}

export function toStatistics(): string {
  return `/statistics`;
}

export function toStatisticsDays(): string {
  return `/statistics/days`;
}

export function toStatisticsDay(date: string): string {
  return `/statistics/days/${date}`;
}

export function toCalendar(): string {
  return `/contractors/deliveries/calendar`;
}

export function toSubscription(): string {
  return `/subscription`;
}

export function toSubscriptionTransactions(): string {
  return `/subscription/transactions`;
}

export function toResetPassword(): string {
  return `/auth/reset-password`;
}

export function toInvited(): string {
  return `/auth/invited`;
}

export function toSignIn(): string {
  return '/auth/login';
}

export function toRegister(): string {
  return '/auth/register';
}

export function fullUrl(path: string): string {
  // Check if we're on the server or client
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
    return new URL(path, baseUrl).href;
  }
  // Client-side: use window.location.origin
  const u = new URL(path, window.location.origin);
  return u.href;
}
