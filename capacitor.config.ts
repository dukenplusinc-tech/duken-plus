import type { CapacitorConfig } from '@capacitor/cli';

const PUBLIC_URL = process.env.PUBLIC_URL || 'https://bp-shop.vercel.app';

const config: CapacitorConfig = {
  appId: 'kz.dukenplus.app',
  appName: 'ShopApp',
  webDir: 'public',
  server: {
    url: PUBLIC_URL,
    cleartext: true,
  },
};

export default config;
