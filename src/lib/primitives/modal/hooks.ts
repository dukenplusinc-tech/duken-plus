import { useContext } from 'react';

import { DialogModalCtx } from '@/lib/primitives/modal/context';

export const useModalDialog = () => {
  return useContext(DialogModalCtx)!;
};
