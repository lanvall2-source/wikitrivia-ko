const isGithubActions = process.env.GITHUB_ACTIONS || false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isGithubActions
    ? {
        output: 'export',
        basePath: '/wikitrivia-ko',
        assetPrefix: '/wikitrivia-ko/',
      }
    : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'thumb.wikimedia.org',
      },
    ],
  },
};

export default nextConfig;
