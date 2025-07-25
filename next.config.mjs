import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const IMAGE_DOMAINS =
  process.env.IMAGE_DOMAINS || 'fsqtsbvalhwspeeomtgj.supabase.co';
const remotePatterns = IMAGE_DOMAINS.split(',').map((hostname) => ({
  protocol: 'https',
  hostname,
}));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default withNextIntl(nextConfig);
