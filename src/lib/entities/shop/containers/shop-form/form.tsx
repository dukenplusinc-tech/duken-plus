'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { useCitiesOptions } from '@/lib/entities/cities/hooks/useCitiesOptions';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useShopForm } from './hooks';

export const UpdateShopForm: FC = () => {
  const t = useTranslations('settings');

  const { form, isProcessing, handleSubmit } = useShopForm();

  const cities = useCitiesOptions();

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>{t('general.form_label_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('general.form_placeholder_name')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>{t('general.form_label_city')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            field.value || t('genera.form_placeholder_city')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(({ group, list }, idx) => (
                          <SelectGroup key={idx.toString()}>
                            <SelectLabel>{group}</SelectLabel>

                            {list.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {t('general.form_description_city')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>{t('general.form_label_address')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('general.form_placeholder_address')}
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
              {t('general.form_save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
