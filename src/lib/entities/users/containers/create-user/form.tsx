import { FC } from 'react';

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
  const { form, handleSubmit } = useUserForm(id);

  const roles = useRoleOptions();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="contact@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We will send confirmation on this email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Enter the user full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose the role" />
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
              <FormDescription>Chose user role</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-4 w-full" type="submit">
          {id ? 'Save' : 'Send Invitation'}
        </Button>
      </form>
    </Form>
  );
};
