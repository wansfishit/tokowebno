import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  devIndicators: false,
  experimental: {
    allowedDevOrigins: ["localhost:3000", "192.168.137.1:3000"]
  } as any
};

export default nextConfig;
