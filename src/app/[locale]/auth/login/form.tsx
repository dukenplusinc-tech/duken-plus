'use client';

import { FC, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';

import * as fromUrl from '@/lib/url/generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { login, recoverPassword } from './actions';

export const LoginForm: FC = () => {
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
          title: 'Password recovery email sent',
          description: 'Please check your inbox and follow the instruction',
        });
      }
    }
  };

  const isLoginMode = mode === 'login';
  const isPassRecover = mode === 'password-recover';

  const submitCaption = isLoginMode
    ? 'Login'
    : isPassRecover
      ? 'Recover password'
      : 'Continue';

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
          />
        </div>

        {isLoginMode && (
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="link"
                className="ml-auto inline-block text-sm underline"
                onClick={() => {
                  setMode('password-recover');
                }}
              >
                Forgot your password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              required
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
                ? 'The password or email you entered is incorrect. Please try again.'
                : 'There was an issue sending the password recovery email. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '...' : submitCaption}
        </Button>
      </form>

      {isLoginMode && (
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="#" className="underline" prefetch={false}>
            Sign up
          </Link>
        </div>
      )}

      {isPassRecover && (
        <div className="mt-4 text-center text-sm">
          Remembered password?
          <Button
            type="button"
            variant="link"
            className="ml-auto inline-block text-sm underline"
            onClick={() => {
              setMode('login');
            }}
          >
            Try to log in
          </Button>
        </div>
      )}
    </>
  );
};
