import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  turbopack: { root: __dirname },
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
};

export default nextConfig;
