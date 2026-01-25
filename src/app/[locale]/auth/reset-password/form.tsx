'use client';

import { FC, FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import * as fromUrl from '@/lib/url/generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OtpInput } from '@/components/ui/otp-input';
import { translateAuthError } from '@/lib/auth/utils/translate-auth-error';
import { useTranslations as useAuthTranslations } from 'next-intl';
import { verifyOtpAndResetPassword } from '../login/actions';

const OTP_LENGTH = 8;

export const ResetPasswordForm: FC = () => {
  const t = useTranslations('reset_pass');
  const tAuth = useAuthTranslations('auth');
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // If no email in URL, redirect to login
  useEffect(() => {
    if (!email) {
      router.replace(fromUrl.toSignIn());
    }
  }, [email, router]);

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (otp.length !== OTP_LENGTH) {
      setError(t('error_invalid_otp'));
      return;
    }

    setIsLoading(true);

    // For OTP verification, we'll verify it when setting password
    // Store OTP temporarily
    setOtpVerified(true);
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('error_wrong_password'));
      return;
    }

    if (password.length < 8) {
      setError(t('error_weak_password') || 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const result = await verifyOtpAndResetPassword({
      email,
      token: otp,
      password,
    });

    setIsLoading(false);

    if (result.error) {
      setError(translateAuthError(result.error, (key) => tAuth(key)));
      setOtpVerified(false);
      setOtp('');
    } else {
      router.replace(fromUrl.toSignIn());
    }
  };

  if (!email) {
    return null;
  }

  // Show OTP input if not verified
  if (!otpVerified) {
    return (
      <>
        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          <div className="space-y-4">
            <Label htmlFor="otp" className="text-sm font-medium text-center block">
              {t('form_label_otp')}
            </Label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={OTP_LENGTH}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground text-center">
              {t('otp_description')}
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <TriangleAlertIcon className="h-4 w-4" />
              <AlertTitle className="break-words">{error}</AlertTitle>
              <AlertDescription className="break-words">{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold sm:h-10 sm:text-sm"
            loading={isLoading}
            disabled={otp.length !== OTP_LENGTH}
            size="lg"
          >
            {t('verify_otp')}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-muted-foreground pt-4 pb-2 border-t mt-4">
          <Link
            href={fromUrl.toSignIn()}
            className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
            prefetch={false}
          >
            {t('back_to_login') || 'Back to login'}
          </Link>
        </div>
      </>
    );
  }

  // Show password reset form after OTP verification
  return (
    <>
      <form className="space-y-4" onSubmit={handlePasswordSubmit}>
        <div>
          <Label htmlFor="password">{t('form_label_password')}</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder={t('form_placeholder_password')}
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
            <AlertTitle className="break-words">{error}</AlertTitle>
            <AlertDescription className="break-words">{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" loading={isLoading}>
          {t('submit')}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-sm text-muted-foreground pt-4 pb-2 border-t mt-4">
        <Link
          href={fromUrl.toSignIn()}
          className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          prefetch={false}
        >
          {t('back_to_login') || 'Back to login'}
        </Link>
      </div>
    </>
  );
};
