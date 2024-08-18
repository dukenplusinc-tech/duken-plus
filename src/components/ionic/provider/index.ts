import dynamic from 'next/dynamic';

export const IonicProvider = dynamic(() => import('./loader'), {
  ssr: false,
});
