'use client';

import { FC, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import * as fromUrl from '@/lib/url/generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { login, recoverPassword } from './actions';

export const LoginForm: FC = () => {
  const t = useTranslations('auth');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'password-recover'>('login');

  const router = useRouter();

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
        redirectTo: fromUrl.fullUrl(fromUrl.toResetPassword()),
      });
    }

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
    } else {
      if (mode === 'login') {
        router.replace(fromUrl.toHome());
      } else {
        setMode('login');
        toast({
          title: t('toast.recover.title'),
          description: t('toast.recover.description'),
        });
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
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">{t('form_label_email')}</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            placeholder={t('form_placeholder_email')}
            disabled={isLoading}
          />
        </div>

        {isLoginMode && (
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{t('form_label_password')}</Label>
              <Button
                type="button"
                variant="link"
                className="ml-auto inline-block text-sm underline"
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
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-2">
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertTitle>{error}</AlertTitle>
            <AlertDescription>
              {mode === 'login'
                ? t('alert.login.description')
                : t('alert.recover.description')}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" loading={isLoading}>
          {t(submitCaption)}
        </Button>
      </form>

      {isLoginMode && (
        <div className="mt-4 text-center text-sm">
          {t('dont_have_account_label')}{' '}
          <Link href="#" className="underline" prefetch={false}>
            {t('signup_label')}
          </Link>
        </div>
      )}

      {isPassRecover && (
        <div className="mt-4 text-center text-sm">
          {t('recover.title')}
          <Button
            type="button"
            variant="link"
            className="ml-auto inline-block text-sm underline"
            onClick={() => {
              setMode('login');
            }}
          >
            {t('recover.btn_caption')}
          </Button>
        </div>
      )}
    </>
  );
};
