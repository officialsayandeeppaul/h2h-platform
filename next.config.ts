import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable View Transitions for smooth page navigation
  experimental: {
    viewTransition: true,
  },
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
