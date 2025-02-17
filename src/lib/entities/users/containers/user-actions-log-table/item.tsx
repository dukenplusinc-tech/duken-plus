import { FC } from 'react';
import Link from 'next/link';
import { IonItem, IonLabel } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { TransactionType } from '@/lib/entities/debtors/schema';
import type { UserActionLog } from '@/lib/entities/users/schema';
import * as fromUrl from '@/lib/url/generator';
import { Badge } from '@/components/ui/badge';
import { FormatDate } from '@/components/date/format-date';

export const UserActionLogItem: FC<{ item: UserActionLog }> = ({ item }) => {
  const t = useTranslations('user_action_logs');

  // Check if the log is related to debtor_transactions
  const isDebtorTransaction = item.entity === 'debtor_transactions';

  // Ensure details is parsed properly (in case it's a JSON string)
  const details =
    typeof item.details === 'string' ? JSON.parse(item.details) : item.details;

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
        </div>

        {isDebtorTransaction && details && (
          <div className="mt-2 text-sm">
            {/* Debtor Name with Edit Link */}
            {/* Amount with color styling */}
            <p>
              <span
                className={`font-bold ${
                  details.transaction_type === TransactionType.loan
                    ? 'text-red-600' // Red for loan (negative)
                    : 'text-green-600' // Green for purchase (positive)
                }`}
              >
                {formattedAmount} $
              </span>
            </p>

            {details.debtor_name && details.debtor_id && (
              <p>
                <strong>{t('debtor_name_caption')}:</strong>{' '}
                <Link
                  href={fromUrl.toDebtorEdit(details.debtor_id)}
                  className="text-blue-600 underline"
                >
                  {details.debtor_name}
                </Link>
              </p>
            )}

            {/* Balance at transaction time */}
            {details.balance_at_transaction !== undefined && (
              <p className="font-medium">
                <strong>{t('debtor_balance_caption')}:</strong>{' '}
                {details.balance_at_transaction} $
              </p>
            )}

            {/* Transaction Description */}
            {details.description && (
              <p className="text-muted">{details.description}</p>
            )}
          </div>
        )}
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
