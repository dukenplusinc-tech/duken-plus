'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import * as fromUrl from '@/lib/url/generator';
import { resendVerification } from '../actions';
import { toast } from '@/components/ui/use-toast';
import { translateAuthError } from '@/lib/auth/utils/translate-auth-error';

interface VerifyStepProps {
  email: string;
}

export const VerifyStep: FC<VerifyStepProps> = ({ email }) => {
  const t = useTranslations('register.verify');
  const tAuth = useTranslations('auth');
  const tTransitions = useTranslations('transitions');
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    const result = await resendVerification(email);
    setIsResending(false);

    if (result.error) {
      const errorMessage =
        result.error === 'email_rate_limit'
          ? tAuth('errors.email_rate_limit')
          : translateAuthError(result.error, (key) => tAuth(key));
      toast({
        title: t('resend_button'),
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('resend_success'),
        description: t('resend_success'),
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('description', { email })}
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-muted/50 p-4 text-left">
        <p className="text-sm text-muted-foreground">{t('instructions')}</p>
      </div>

      {/* Resend Button */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('resend_label')}</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? tTransitions('loading_btn') : t('resend_button')}
        </Button>
      </div>

      {/* Back to Login */}
      <div className="pt-4 border-t">
        <Link
          href={fromUrl.toSignIn()}
          className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
        >
          {t('back_to_login')}
        </Link>
      </div>
    </div>
  );
};
