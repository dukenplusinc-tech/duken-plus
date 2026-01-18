'use client';

import { FC, FormEvent, useState } from 'react';
import Link from 'next/link';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as fromUrl from '@/lib/url/generator';
import { translateAuthError } from '@/lib/auth/utils/translate-auth-error';

import { register } from './actions';
import { AccountStep, type AccountStepData } from './steps/account-step';
import { ShopStep, type ShopStepData } from './steps/shop-step';
import { VerifyStep } from './steps/verify-step';

type RegistrationData = AccountStepData & ShopStepData;

const TOTAL_STEPS = 3;

export const RegisterForm: FC = () => {
  const t = useTranslations('register');
  const tAuth = useTranslations('auth');
  const locale = useLocale();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    passwordConfirm: '',
    fullName: '',
    phone: '',
    shopName: '',
    city: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('errors.required_field');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.invalid_email');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('errors.required_field');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.weak_password');
    }

    // Password confirmation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = t('errors.required_field');
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = t('errors.passwords_dont_match');
    }

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = t('errors.required_field');
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t('errors.required_field');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (!formData.shopName || formData.shopName.trim().length === 0) {
      newErrors.shopName = t('errors.required_field');
    }

    if (!formData.city) {
      newErrors.city = t('errors.required_field');
    }

    if (!formData.address || formData.address.trim().length === 0) {
      newErrors.address = t('errors.required_field');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        setError('');
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        // Step 2 validation passed, will submit on button click
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
      setErrors({});
    }
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (currentStep === 2 && !validateStep2()) {
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone || undefined,
      shopName: formData.shopName,
      city: formData.city,
      address: formData.address,
      locale: locale,
    });

    setIsLoading(false);

    if (result.error) {
      if (result.error === 'email_exists') {
        setError(t('errors.email_exists'));
      } else {
        setError(
          translateAuthError(result.error, (key) => tAuth(`errors.${key}`))
        );
      }
    } else if (result.success && result.email) {
      setRegisteredEmail(result.email);
      setCurrentStep(3);
    }
  };

  const progressValue = (currentStep / TOTAL_STEPS) * 100;
  const stepTitle =
    currentStep === 1
      ? t('account.title')
      : currentStep === 2
        ? t('shop.title')
        : t('verify.title');

  // Show verification step
  if (currentStep === 3 && registeredEmail) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Progress value={progressValue} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {t('step_indicator', { current: currentStep, total: TOTAL_STEPS })}
          </p>
        </div>
        <VerifyStep email={registeredEmail} />
      </div>
    );
  }

  return (
    <form className="space-y-6 pb-2" onSubmit={handleSubmit}>
      {/* Progress Indicator */}
      <div className="space-y-2">
        <Progress value={progressValue} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">
          {t('step_indicator', { current: currentStep, total: TOTAL_STEPS })}
        </p>
      </div>

      {/* Step Content */}
      <div className="space-y-5">
        {currentStep === 1 && (
          <AccountStep
            data={{
              email: formData.email,
              password: formData.password,
              passwordConfirm: formData.passwordConfirm,
              fullName: formData.fullName,
              phone: formData.phone,
            }}
            onChange={(updates) => {
              setFormData((prev) => ({ ...prev, ...updates }));
              // Clear errors for updated fields
              setErrors((prev) => {
                const newErrors = { ...prev };
                Object.keys(updates).forEach((key) => {
                  delete newErrors[key as keyof RegistrationData];
                });
                return newErrors;
              });
            }}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <ShopStep
            data={{
              shopName: formData.shopName,
              city: formData.city,
              address: formData.address,
            }}
            onChange={(updates) => {
              setFormData((prev) => ({ ...prev, ...updates }));
              // Clear errors for updated fields
              setErrors((prev) => {
                const newErrors = { ...prev };
                Object.keys(updates).forEach((key) => {
                  delete newErrors[key as keyof RegistrationData];
                });
                return newErrors;
              });
            }}
            errors={errors}
          />
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertTitle className="text-sm break-words">{error}</AlertTitle>
          <AlertDescription className="text-xs break-words">
            {t('errors.registration_failed')}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isLoading}
            className="flex-1 h-11 text-base sm:h-10 sm:text-sm"
          >
            {t('buttons.back')}
          </Button>
        )}
        <Button
          type={currentStep === 2 ? 'submit' : 'button'}
          onClick={currentStep === 2 ? undefined : handleNext}
          loading={isLoading}
          className="flex-1 h-11 text-base sm:h-10 sm:text-sm"
          size="lg"
        >
          {currentStep === 2 ? t('buttons.register') : t('buttons.next')}
        </Button>
      </div>

      {/* Footer Link - Always visible to allow escaping registration */}
      <div className="text-center text-sm text-muted-foreground pt-4 pb-2 border-t mt-4">
        {t('already_have_account')}{' '}
        <Link
          href={fromUrl.toSignIn()}
          className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          prefetch={false}
        >
          {t('login_link')}
        </Link>
      </div>
    </form>
  );
};
