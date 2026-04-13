import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'], 
  },
  devIndicators: false,

};

export default nextConfig;
