'use client';

import { FC } from 'react';

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
                  <FormLabel>Your Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you full name" {...field} />
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
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you email"
                      type="email"
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
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Your Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you phone"
                      type="phone"
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
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={field.value || 'Choose the language'}
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
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};
