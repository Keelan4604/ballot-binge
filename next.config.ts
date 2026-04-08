import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages via OpenNext
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
