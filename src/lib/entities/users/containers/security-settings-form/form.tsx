'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

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

import { useSecuritySettingsForm } from './hooks';

export const SecuritySettingsForm: FC = () => {
  const t = useTranslations('settings');

  const { form, isProcessing, handleSubmit } = useSecuritySettingsForm();

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>{t('security.form_label_password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('security.form_placeholder_password')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirm"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>
                    {t('security.form_label_password_confirm')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t(
                        'security.form_placeholder_password_confirm'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" loading={isProcessing}>
              {t('security.form_save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
