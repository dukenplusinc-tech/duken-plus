import { FC } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

import type { Contractor } from '@/lib/entities/contractors/schema';
import { DropdownButton } from '@/components/ui/ionic/dropdown';

import { useContractorDotMenu } from './dot-menu';

interface ContractorItemProps {
  contractor: Contractor;
}

export const ContractorItem: FC<ContractorItemProps> = ({ contractor }) => {
  const options = useContractorDotMenu(contractor);

  return (
    <IonItem key={contractor.id}>
      <IonLabel>{contractor.title || '---'}</IonLabel>
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
