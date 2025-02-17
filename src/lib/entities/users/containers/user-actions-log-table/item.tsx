import { FC } from 'react';
import { IonItem, IonLabel } from '@ionic/react';

import { TransactionType } from '@/lib/entities/debtors/schema';
import type { UserActionLog } from '@/lib/entities/users/schema';
import { Badge } from '@/components/ui/badge';
import { FormatDate } from '@/components/date/format-date';

export const UserActionLogItem: FC<{ item: UserActionLog }> = ({ item }) => {
  // Check if the log is related to debtor_transactions
  const isDebtorTransaction = item.entity === 'debtor_transactions';

  const { details } = item;

  // Determine the formatted amount (+/-)
  const formattedAmount =
    details && details.transaction_type === TransactionType.loan
      ? `-${details.amount}`
      : `+${details.amount}`;

  return (
    <IonItem lines="full">
      <IonLabel>
        <p className="truncate text-sm text-muted">
          Entity ID: {item.entity_id}
        </p>

        {/* Action & Entity Badges */}
        <div className="flex items-center gap-2">
          <Badge className="mr-2">{item.action}</Badge>
          <Badge variant="outline">{item.entity}</Badge>

          {isDebtorTransaction && details && (
            <div className="text-sm">
              <p>
                <span
                  className={`font-bold ${
                    details.transaction_type === TransactionType.loan
                      ? 'text-red-600' // Red for loan (negative)
                      : 'text-success' // Green for purchase (positive)
                  }`}
                >
                  {formattedAmount}
                </span>
              </p>
              {details.description && (
                <p className="text-muted">{details.description}</p>
              )}
            </div>
          )}
        </div>
      </IonLabel>

      {/* Timestamp */}
      <IonLabel slot="end" className="ion-text-end">
        <p className="font-medium">
          <FormatDate>{item.timestamp}</FormatDate>
        </p>
      </IonLabel>
    </IonItem>
  );
};
