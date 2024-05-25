import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { changePassword } from './actions';

export const ChangePasswordCard: FC = () => {
  return (
    <form>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Enter new password to change it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              autoComplete="new-password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" formAction={changePassword}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
