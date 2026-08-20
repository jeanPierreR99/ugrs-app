import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.16.1.101",
  ],

  reactStrictMode: true,
};

export default nextConfig;