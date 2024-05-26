import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.vercel.bekbo.shop',
  appName: 'bp-shop',
  webDir: 'public',
  server: {
    url: 'http://192.168.68.102:3000',
    cleartext: true,
  },
};

export default config;
