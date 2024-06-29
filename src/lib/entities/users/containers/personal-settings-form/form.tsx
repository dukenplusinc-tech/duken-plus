'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { languages } from '@/config/languages';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { usePersonalForm } from './hooks';

export const PersonalSettingsForm: FC = () => {
  const t = useTranslations('settings.personal');

  const { form, isProcessing, handleSubmit } = usePersonalForm();

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>{t('form_label_full_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_placeholder_full_name')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>{t('form_label_email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('form_placeholder_email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field: { value, ...field } }) => (
                <FormItem className="mb-4">
                  <FormLabel>{t('form_label_phone')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_placeholder_phone')}
                      value={value || ''}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>{t('form_label_lang')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ''}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            field.value || t('form_placeholder_lang')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" loading={isProcessing}>
              {t('form_save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
