export function truncate(target: string | null, limit = 10): string | null {
  if (!target) {
    return target;
  }

  if (target.length <= limit) {
    return target;
  }

  return `${target.slice(0, limit)}...`
}
