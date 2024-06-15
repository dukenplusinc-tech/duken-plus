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

import { login } from './actions';

export const LoginForm: FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await login(formData);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
    } else {
      router.replace(fromUrl.toHome());
    }
  };

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
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="ml-auto inline-block text-sm underline"
              prefetch={false}
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertTitle>{error}</AlertTitle>
            <AlertDescription>
              The password or email you entered is incorrect. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '...' : 'Login'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="#" className="underline" prefetch={false}>
          Sign up
        </Link>
      </div>
    </>
  );
};
