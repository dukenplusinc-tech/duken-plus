import { FC } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { useTranslations } from 'next-intl';

import { useDebtorTransactionDotMenu } from '@/lib/entities/debtors/containers/debtor-history-table/dot-menu';
import {
  DebtorTransaction,
  TransactionType,
} from '@/lib/entities/debtors/schema';
import { cn } from '@/lib/utils';
import { formatTZ } from '@/lib/utils/tz';
import { DropdownButton } from '@/components/ui/ionic/dropdown';

interface DebtorTransactionItemProps {
  transaction: DebtorTransaction;
}

interface LocalDateTimeDisplayProps {
  utcDateString: string | null | undefined;
}

const LocalDateTimeDisplay: FC<LocalDateTimeDisplayProps> = ({
  utcDateString,
}) => {
  if (!utcDateString) return null;

  const normalized = utcDateString.endsWith('Z') ? utcDateString : `${utcDateString}Z`;

  return (
    <>
      <div>{formatTZ(normalized, 'dd.MM.yyyy')}</div>
      <div>{formatTZ(normalized, 'HH:mm:ss')}</div>
    </>
  );
};

export const DebtorTransactionItem: FC<DebtorTransactionItemProps> = ({
  transaction,
}) => {
  const t = useTranslations('debtor_transactions');

  const options = useDebtorTransactionDotMenu(transaction);

  const { transaction_type, amount, transaction_date, description } =
    transaction;

  const isLoan = transaction_type === TransactionType.loan;

  const sign = isLoan ? '-' : '+';

  return (
    <IonItem>
      <div className="text-black text-right mr-4">
        <div
          className={cn('font-bold', isLoan ? 'text-red-600' : 'text-success')}
        >
          {sign}
          {amount.toFixed(2)}
        </div>
        <LocalDateTimeDisplay utcDateString={transaction_date} />
      </div>
      <IonLabel>
        <div className="text-black">
          <div className="font-medium capitalize">
            {transaction?.debtor?.full_name}
          </div>
          <div>{description || '---'}</div>
        </div>
      </IonLabel>
      {transaction?.added_by && (
        <div className="font-medium">
          {t('captions_by')} {transaction?.added_by}
        </div>
      )}
      {options.length > 0 && (
        <DropdownButton
          button={
            <IonButton fill="clear">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
          }
          options={options}
        />
      )}
    </IonItem>
  );
};
