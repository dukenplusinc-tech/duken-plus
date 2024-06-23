'use client';

import * as React from 'react';

import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { Button } from '@/components/ui/button';

import { UserForm } from './form';

export function CreateUserDialog() {
  const dialog = useModalDialog();

  const onOpen = () => {
    dialog.launch({
      render: <UserForm />,
      title: 'Invite New User',
    });
  };

  return <Button onClick={onOpen}>Invite new user</Button>;
}
