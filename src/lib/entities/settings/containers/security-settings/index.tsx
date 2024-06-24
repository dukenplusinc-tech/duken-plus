import { FC } from 'react';

import { SecuritySettingsForm } from '@/lib/entities/users/containers/security-settings-form/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const SecuritySettings: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Fill in the details</CardDescription>
      </CardHeader>

      <SecuritySettingsForm />
    </Card>
  );
};
