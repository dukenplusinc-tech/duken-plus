export function toHome(): string {
  return `/`;
}

export function toIssues(): string {
  return `/issues`;
}

export function toDevices(): string {
  return `/devices`;
}

export function toDevice(id: string): string {
  return `/devices/${id}`;
}

export function toSettings(): string {
  return `/settings`;
}

export function toIssue(id: string): string {
  return `/issues/${id}`;
}

export function toDashboardDevice(
  proxyUrl: string,
  id: string | number
): string {
  return `${proxyUrl}device/show/${id}`;
}
