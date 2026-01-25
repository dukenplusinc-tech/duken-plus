'use client';

import { FC, FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import * as fromUrl from '@/lib/url/generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { login, recoverPassword } from './actions';
import { translateAuthError } from '@/lib/auth/utils/translate-auth-error';

export const LoginForm: FC = () => {
  const t = useTranslations('auth');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'password-recover'>('login');

  // Check for error query parameter on mount
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'profile_not_found') {
      setError(t('errors.profile_not_found') || 'Profile not found. Please contact support.');
      // Clean up URL
      router.replace(fromUrl.toSignIn());
    }
  }, [searchParams, router, t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    let response;
    if (mode === 'login') {
      response = await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
    } else {
      const email = formData.get('email') as string;
      response = await recoverPassword({
        email,
        locale: locale,
      });
    }

    setIsLoading(false);

    if (response.error) {
      setError(translateAuthError(response.error, (key) => t(key)));
    } else {
      if (mode === 'login') {
        router.replace(fromUrl.toInit());
      } else {
        // Redirect to reset password page with email
        const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
        router.push(`${fromUrl.toResetPassword()}?email=${encodeURIComponent(email)}`);
      }
    }
  };

  const isLoginMode = mode === 'login';
  const isPassRecover = mode === 'password-recover';

  const submitCaption = isLoginMode
    ? 'submit_login'
    : isPassRecover
      ? 'submit_recover'
      : 'submit_continue';

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t('form_label_email')}
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            placeholder={t('form_placeholder_email')}
            disabled={isLoading}
            className="h-11 text-base sm:h-10 sm:text-sm"
            autoComplete="email"
            autoFocus
          />
        </div>

        {/* Password Field - Only in login mode */}
        {isLoginMode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                {t('form_label_password')}
              </Label>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs sm:text-sm text-primary hover:text-primary/80"
                onClick={() => {
                  setMode('password-recover');
                }}
              >
                {t('forgot_pass_label')}
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              required
              placeholder={t('form_placeholder_password')}
              disabled={isLoading}
              className="h-11 text-base sm:h-10 sm:text-sm"
              autoComplete="current-password"
            />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mt-1">
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertTitle className="text-sm break-words">{error}</AlertTitle>
            <AlertDescription className="text-xs break-words">
              {mode === 'login'
                ? t('alert.login.description')
                : t('alert.recover.description')}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold sm:h-10 sm:text-sm"
          loading={isLoading}
          size="lg"
        >
          {t(submitCaption)}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="space-y-3 pt-2 border-t">
        {isLoginMode && (
          <div className="text-center text-sm text-muted-foreground">
            {t('dont_have_account_label')}{' '}
            <Link
              href={fromUrl.toRegister()}
              className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
              prefetch={false}
            >
              {t('signup_label')}
            </Link>
          </div>
        )}

        {isPassRecover && (
          <div className="text-center text-sm text-muted-foreground">
            {t('recover.title')}{' '}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
              onClick={() => {
                setMode('login');
              }}
            >
              {t('recover.btn_caption')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
