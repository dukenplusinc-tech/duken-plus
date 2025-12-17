import { FC } from 'react';
import { IonItem } from '@ionic/react';
import { useTranslations } from 'next-intl';

import { useBankNames } from '@/lib/entities/cash-desk/hooks/useBankNames';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';

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
  const tDialog = useTranslations('dialog');

  const handleSetBank = (bankName: string) => () => onChange(bankName);

  return (
    <IonItem className="p-2">
      <div className="flex gap-2 mb-2">
        <Button type="button" onClick={handleSetBank('Каспи')}>
          Каспи
        </Button>
        <Button type="button" onClick={handleSetBank('Халык')}>
          Халык
        </Button>
      </div>

      <Autocomplete
        className="mb-2"
        options={banks}
        value={value || ''}
        disabled={disabled}
        onValueChange={(selectedValue) => {
          onChange?.(selectedValue);
        }}
        placeholder={t('form_label_bank_name')}
        searchPlaceholder={t('form_label_bank_search_placeholder')}
        emptyMessage={t('form_label_bank_empty')}
        allowCustomValue
        customValueMessage={(val) => `${t('form_label_bank_use')} \"${val}\"`}
        cancelButtonText={tDialog('cancel')}
      />
    </IonItem>
  );
};
