export function toHome(): string {
  return `/`;
}

export function toInit(): string {
  return `/init`;
}

export function toSettings(): string {
  return `/settings`;
}

export function toSecuritySettings(): string {
  return `/settings/security`;
}

export function toPersonalSettings(): string {
  return `/settings/personal`;
}

export function toUsers(): string {
  return `/users`;
}

export function toUser(id: string): string {
  return `/users/${id}`;
}

export function toContractors(): string {
  return `/contractors`;
}

export function toDebtors(): string {
  return `/debtors`;
}

export function toBlacklist(): string {
  return `/blacklist`;
}

export function toCashDesk(): string {
  return `/cash-desk`;
}

export function toNotes(): string {
  return `/notes`;
}

export function toChat(): string {
  return `/chat`;
}

export function toStatistics(): string {
  return `/statistics`;
}

export function toSubscription(): string {
  return `/subscription`;
}

export function toResetPassword(): string {
  return `/auth/reset-password`;
}

export function toInvited(): string {
  return `/auth/invited`;
}

export function fullUrl(path: string): string {
  const u = new URL(path, window.location.origin);

  return u.href;
}
