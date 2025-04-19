import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Configure webpack to handle browser-specific libraries like p5.js
  webpack: (config) => {
    // This ensures p5.js and other browser-only libraries 
    // don't run during server-side rendering
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      "fs/promises": false,
    };
    
    return config;
  },
};

export default nextConfig;