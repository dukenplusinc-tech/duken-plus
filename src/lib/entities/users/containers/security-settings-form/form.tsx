'use client';

import { FC } from 'react';

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
  const { form, isProcessing, handleSubmit } = useSecuritySettingsForm();

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FormField
              control={form.control}
              name="password"
              type="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Your New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirm"
              type="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Enter again Your Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you new password again"
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
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
