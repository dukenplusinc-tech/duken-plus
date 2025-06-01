import { useCallback } from 'react';

import { EmployeeMode } from '@/lib/entities/employees/containers/employee-mode';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useEnterEmployeeMode() {
  const dialog = useModalDialog();

  return useCallback(() => {
    dialog.launch({
      dialog: true,
      footer: false,
      wrapperClassName: 'max-h-content min-h-[70vh]',
      render: (
        <EmployeeMode
          onSuccess={() => {
            dialog.close();
          }}
        />
      ),
    });
  }, [dialog]);
}
