import { FC } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

import { useTransactionForm } from '@/lib/entities/debtors/containers/transaction-form';
import type { Debtor } from '@/lib/entities/debtors/schema';
import { simplifyNumber } from '@/lib/primitives/numbers/simplifyNumber';
import { Badge } from '@/components/ui/badge';
import { DropdownButton } from '@/components/ui/ionic/dropdown';

import { useDebtorDotMenu } from './dot-menu';

interface DebtorItemProps {
  debtor: Debtor;
}

export const DebtorItem: FC<DebtorItemProps> = ({ debtor }) => {
  const options = useDebtorDotMenu(debtor);

  const handleAddTransactionRecord = useTransactionForm({
    debtor_id: debtor.id,
  });

  const color = debtor.is_overdue
    ? 'danger'
    : debtor.balance > 0
      ? 'success'
      : undefined;

  return (
    <IonItem
      key={debtor.id}
      color={color}
      onClick={() => handleAddTransactionRecord(debtor.balance)}
    >
      <IonLabel>
        <span className="text-black">{debtor.full_name || '---'}</span>
        {debtor.max_credit_amount && (
          <Badge className="ml-2">
            {simplifyNumber(debtor.max_credit_amount)}
          </Badge>
        )}
      </IonLabel>
      <span className="text-black font-bold">{debtor.balance}</span>
      <DropdownButton
        button={
          <IonButton fill="clear">
            <IonIcon slot="icon-only" icon={ellipsisVertical} />
          </IonButton>
        }
        options={options}
      />
    </IonItem>
  );
};
