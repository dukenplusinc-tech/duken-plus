import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.vercel.bekbo.shop',
  appName: 'ShopApp',
  webDir: 'public',
  server: {
    url: 'https://bp-shop.vercel.app',
    cleartext: true,
  },
};

export default config;
