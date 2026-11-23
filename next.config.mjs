const isTossBuild = process.env.TOSS_BUILD === 'true';
const isGithubActions = !isTossBuild && (process.env.GITHUB_ACTIONS || false);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  ...(isGithubActions
    ? {
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
