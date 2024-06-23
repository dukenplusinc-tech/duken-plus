import { FC } from 'react';

import { UpdateShopForm } from '@/lib/entities/shop/containers/shop-form/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const GeneralShopSettings: FC = () => {
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Shop Details</CardTitle>
        <CardDescription>Fill the shop details</CardDescription>
      </CardHeader>

      <UpdateShopForm />
    </Card>
  );
};
