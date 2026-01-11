/**
 * Translates Supabase auth error messages to user-friendly localized messages
 */
export function translateAuthError(
  errorMessage: string,
  t: (key: string) => string
): string {
  const message = errorMessage.toLowerCase();

  // Invalid login credentials
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid_credentials') ||
    message.includes('email not confirmed')
  ) {
    return t('errors.invalid_credentials');
  }

  // Email not confirmed
  if (message.includes('email not confirmed')) {
    return t('errors.email_not_confirmed');
  }

  // User not found
  if (message.includes('user not found') || message.includes('user_not_found')) {
    return t('errors.user_not_found');
  }

  // Email rate limit
  if (
    message.includes('email rate limit') ||
    message.includes('rate_limit_exceeded')
  ) {
    return t('errors.email_rate_limit');
  }

  // Password too weak
  if (
    message.includes('password') &&
    (message.includes('weak') || message.includes('too short'))
  ) {
    return t('errors.password_too_weak');
  }

  // Token expired or invalid
  if (
    message.includes('token') &&
    (message.includes('expired') || message.includes('invalid'))
  ) {
    return t('errors.invalid_token');
  }

  // Session expired
  if (message.includes('session') && message.includes('expired')) {
    return t('errors.session_expired');
  }

  // Generic error fallback
  return t('errors.generic');
}
