'use client';

import { FC, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PhoneInputSimple } from '@/components/ui/phone-input-simple';

export interface AccountStepData {
  email: string;
  password: string;
  passwordConfirm: string;
  fullName: string;
  phone: string;
}

interface AccountStepProps {
  data: AccountStepData;
  onChange: (data: Partial<AccountStepData>) => void;
  errors: Partial<Record<keyof AccountStepData, string>>;
}

export const AccountStep: FC<AccountStepProps> = ({ data, onChange, errors }) => {
  const t = useTranslations('register.account');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 8) return 'weak';
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return 'medium';
    }
    return 'strong';
  };

  const passwordStrength = data.password ? getPasswordStrength(data.password) : null;

  return (
    <div className="space-y-5">
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
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="h-11 text-base sm:h-10 sm:text-sm"
          autoComplete="email"
          autoFocus
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {t('form_label_password')}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder={t('form_placeholder_password')}
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            className="h-11 text-base sm:h-10 sm:text-sm pr-10"
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {passwordStrength && (
          <p className="text-xs text-muted-foreground">
            {t(`password_strength.${passwordStrength}`)}
          </p>
        )}
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="passwordConfirm" className="text-sm font-medium">
          {t('form_label_password_confirm')}
        </Label>
        <div className="relative">
          <Input
            id="passwordConfirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            name="passwordConfirm"
            required
            placeholder={t('form_placeholder_password_confirm')}
            value={data.passwordConfirm}
            onChange={(e) => onChange({ passwordConfirm: e.target.value })}
            className="h-11 text-base sm:h-10 sm:text-sm pr-10"
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
          >
            {showPasswordConfirm ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {errors.passwordConfirm && (
          <p className="text-xs text-destructive">{errors.passwordConfirm}</p>
        )}
      </div>

      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          {t('form_label_full_name')}
        </Label>
        <Input
          id="fullName"
          type="text"
          name="fullName"
          required
          placeholder={t('form_placeholder_full_name')}
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className="h-11 text-base sm:h-10 sm:text-sm"
          autoComplete="name"
          autoCapitalize="words"
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          {t('form_label_phone')}
        </Label>
        <PhoneInputSimple
          id="phone"
          value={data.phone || ''}
          onChange={(value) => onChange({ phone: value })}
          placeholder={t('form_placeholder_phone')}
          className="h-11 text-base sm:h-10 sm:text-sm"
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone}</p>
        )}
      </div>
    </div>
  );
};
