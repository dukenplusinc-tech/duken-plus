import { FC } from 'react';
import { IonItem, IonLabel } from '@ionic/react';

import { SubscriptionPayment } from '@/lib/entities/subscription/schema';

interface SubscriptionPaymentItemProps {
  payment: SubscriptionPayment;
}

export const SubscriptionPaymentItem: FC<SubscriptionPaymentItemProps> = ({
  payment,
}) => {
  const { amount, date, transaction_id, payment_method, note } = payment;

  return (
    <IonItem>
      <div className="text-black text-right mr-4">
        <div className="font-bold text-success">{amount.toFixed(2)} </div>
        <div>{date && new Date(date).toLocaleDateString()}</div>
        <div>{payment_method}</div>
      </div>
      <IonLabel>
        <div className="text-black">
          <div className="font-medium capitalize">{transaction_id}</div>
          <div>{note || '---'}</div>
          <div className="font-medium">&nbsp;</div>
        </div>
      </IonLabel>
    </IonItem>
  );
};
