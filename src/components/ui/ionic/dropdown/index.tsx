import { FC, MouseEvent, ReactNode, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

export interface DropDownButtonOption {
  label: string | ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownButtonProps {
  options: DropDownButtonOption[];
  className?: string;
  button?: ReactNode; // Custom button or trigger slot
}

export const DropdownButton: FC<DropdownButtonProps> = ({
  options,
  className,
  button,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(
    undefined
  );

  const openPopover = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setPopoverEvent(e);
    setShowPopover(true);
  };

  return (
    <>
      {/* Render custom button if provided, otherwise render default button */}
      {button ? (
        <div className={className} onClick={openPopover}>
          {button}
        </div>
      ) : (
        <IonButton color="success" onClick={openPopover}>
          <IonIcon
            slot="icon-only"
            size="large"
            className="text-white"
            icon={ellipsisVertical}
          />
        </IonButton>
      )}

      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowPopover(false)}
        onClick={(event) => {
          event.stopPropagation();
        }}
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
