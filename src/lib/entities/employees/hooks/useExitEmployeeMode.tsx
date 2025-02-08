import { useCallback } from 'react';

import { ExitEmployeeMode } from '@/lib/entities/employees/containers/exit-employee-mode';
import { useModalDialog } from '@/lib/primitives/modal/hooks';

export function useExitEmployeeMode() {
  const dialog = useModalDialog();

  return useCallback(() => {
    dialog.launch({
      dialog: true,
      footer: false,
      wrapperClassName: 'max-h-content',
      render: <ExitEmployeeMode />,
    });
  }, [dialog]);
}
