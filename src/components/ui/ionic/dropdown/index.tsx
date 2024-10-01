'use client';

import { FC, MouseEvent, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

interface DropdownButtonProps {
  options: { label: string; onClick: () => void; disabled?: boolean }[];
}

export const DropdownButton: FC<DropdownButtonProps> = ({ options }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(
    undefined
  );

  const openPopover = (e: MouseEvent) => {
    e.preventDefault();
    setPopoverEvent(e);
    setShowPopover(true);
  };

  return (
    <>
      <IonButton color="success" onClick={openPopover}>
        <IonIcon
          slot="icon-only"
          size="large"
          className="text-white"
          icon={ellipsisVertical}
        />
      </IonButton>

      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonList>
          {options.map((option, index) => (
            <IonItem
              button
              key={index}
              onClick={() => {
                setShowPopover(false);

                if (option.onClick) {
                  option.onClick();
                }
              }}
              disabled={option.disabled || false}
            >
              <IonLabel>{option.label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
    </>
  );
};
