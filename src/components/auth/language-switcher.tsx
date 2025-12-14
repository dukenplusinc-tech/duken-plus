'use client';

import { FC } from 'react';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

import { languages } from '@/config/languages';
import { useChangeLocale } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ className }) => {
  const locale = useLocale();
  const changeLocale = useChangeLocale();

  const currentLanguage = languages.find((lang) => lang.value === locale);

  return (
    <div className={className}>
      <Select
        value={locale}
        onValueChange={(value) => {
          changeLocale(value as typeof locale);
        }}
      >
        <SelectTrigger className="w-full sm:w-auto min-w-[140px] h-9 relative z-50">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <SelectValue>
              {currentLanguage?.label || locale.toUpperCase()}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
