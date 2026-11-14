import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Image uploads go through server actions (uploadImage/uploadImageFromUrl)
  // as raw file bytes before compression — Next's default 1MB action body
  // limit silently rejected any real product photo above that, below the
  // 8MB ceiling actually enforced in src/actions/upload.ts.
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
