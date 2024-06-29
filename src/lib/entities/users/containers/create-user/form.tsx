import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { useUserForm } from '@/lib/entities/users/containers/create-user/hooks';
import { useRoleOptions } from '@/lib/entities/users/hooks/useRoleOptions';
import { Button } from '@/components/ui/button';
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const UserForm: FC<{ id?: string }> = ({ id }) => {
  const t = useTranslations('users.invite');

  const { form, isProcessing, handleSubmit } = useUserForm(id);

  const roles = useRoleOptions();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>{t('form_label_email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form_placeholder_email')} {...field} />
              </FormControl>
              <FormDescription>{t('form_description_email')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>{t('form_label_full_name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form_placeholder_full_name')}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('form_description_full_name')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>{t('form_label_role')}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('form_placeholder_role')} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value.toString()}
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>{t('form_description_role')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button loading={isProcessing} className="mt-4 w-full" type="submit">
          {t('form_submit')}
        </Button>
      </form>
    </Form>
  );
};
