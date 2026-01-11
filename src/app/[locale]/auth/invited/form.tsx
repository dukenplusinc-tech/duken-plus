'use client';

import { FC, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { createClient } from '@/lib/supabase/client';
import * as fromUrl from '@/lib/url/generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translateAuthError } from '@/lib/auth/utils/translate-auth-error';
import { useTranslations as useAuthTranslations } from 'next-intl';

export const SetPasswordForm: FC = () => {
  const t = useTranslations('invited');
  const tAuth = useAuthTranslations('auth');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState({ access_token: '', refresh_token: '' });

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      setToken({ access_token: accessToken, refresh_token: refreshToken });
    } else {
      setError(t('error_invalid_token'));
    }
  }, [t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('error_wrong_password'));
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    // Set the session with access and refresh tokens
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    });

    if (sessionError) {
      setIsLoading(false);
      setError(translateAuthError(sessionError.message, (key) => tAuth(key)));
      return;
    }

    // Now, update the user with the new password
    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      setError(translateAuthError(error.message, (key) => tAuth(key)));
    } else {
      router.replace(fromUrl.toHome());
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="password">{t('form_label_password')}</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder={t('form_placeholder_password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">
          {t('form_label_password_confirm')}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          name="confirm-password"
          placeholder={t('form_placeholder_password_confirm')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertTitle>{error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {t('submit')}
      </Button>
    </form>
  );
};
