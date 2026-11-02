import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;