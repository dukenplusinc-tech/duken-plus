import { FC } from 'react';
import { IonItem } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useBankNames } from '@/lib/entities/cash-desk/hooks/useBankNames';
import { Autocomplete } from '@/components/ui/autocomplete';

export type BankValue = string | null | undefined;

export interface BankSelectProps {
  value: BankValue;
  disabled?: boolean;
  onChange: (value: BankValue) => void;
}

export const BankSelect: FC<BankSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { banks } = useBankNames();
  const t = useTranslations('cash_desk.form');

  return (
    <>
      <IonItem>
        <Autocomplete
          options={banks}
          value={value || ''}
          disabled={disabled}
          onValueChange={(value) => {
            if (onChange) {
              onChange(value);
            }
          }}
          placeholder={t('form_label_bank_name')}
          searchPlaceholder="Search banks..."
          emptyMessage="No banks found."
          allowCustomValue={true}
          customValueMessage={(val) => `Use "${val}"`}
        />
      </IonItem>
    </>
  );
};
