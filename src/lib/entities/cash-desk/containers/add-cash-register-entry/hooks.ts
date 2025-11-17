import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/composite/form/useForm';
import { createCashRegisterEntry } from '@/lib/entities/cash-desk/actions/createCashRegisterEntry';
import { useBankNames } from '@/lib/entities/cash-desk/hooks/useBankNames';
import { useCashDeskStat } from '@/lib/entities/cash-desk/hooks/useCashDeskStat';
import { useComplexCashDeskEntries } from '@/lib/entities/cash-desk/hooks/useComplexCashDeskEntries';
import {
  CashRegisterPayload,
  CashRegisterType,
  cashRegisterPayloadSchema as schema,
} from '@/lib/entities/cash-desk/schema';
import { useAddedBy } from '@/lib/entities/debtors/hooks/useAddedBy';

export interface DebtorAddCashRegisterEntryParams {
  type?: CashRegisterType;
}

export function useAddCashRegisterEntry({
  type,
}: DebtorAddCashRegisterEntryParams) {
  const t = useTranslations('validation.success');
  const { refresh: refreshStats } = useCashDeskStat();
  const { refresh: refreshBanks } = useBankNames();
  const { refresh: refreshEntries } = useComplexCashDeskEntries();

  const defaultValues: CashRegisterPayload = useMemo(() => {
    return {
      from: '',
      amount: 0,
      bank_name: '',
      added_by: '',
      type: type || CashRegisterType.CASH,
    };
  }, [type]);

  const added_by = useAddedBy();

  return useForm<typeof schema, CashRegisterPayload>({
    defaultValues,
    request: async (values) => {
      values.added_by = added_by;

      await createCashRegisterEntry(values);
      await Promise.all([refreshStats(), refreshBanks(), refreshEntries()]);
    },
    schema,
    successMessage: {
      title: t('cash_entry_added_title'),
      description: t('cash_entry_added_description'),
    },
  });
}
