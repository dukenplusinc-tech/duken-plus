import { FC } from 'react';

import { PersonalSettingsForm } from '@/lib/entities/users/containers/personal-settings-form/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const PersonalSettings: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Settings</CardTitle>
        <CardDescription>Fill in the details</CardDescription>
      </CardHeader>

      <PersonalSettingsForm />
    </Card>
  );
};
