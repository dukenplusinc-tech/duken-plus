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
  // Force Webpack usage (Turbopack has issues with Ionic/Stencil CSS and dynamic imports)
  // Use --webpack flag in package.json scripts to force Webpack
  webpack: (config, { isServer }) => {
    // Handle Stencil dynamic imports for client-side
    if (!isServer) {
      // Configure webpack to handle dynamic imports from Stencil
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      
      // Add rule to handle .entry.js files from Stencil
      config.module.rules.push({
        test: /\.entry\.js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      });
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);
