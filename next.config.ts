import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Next.js 16 uses Turbopack by default
  // Empty config silences the webpack migration warning
  // Our p5.js sketches use 'use client' so no SSR concerns
  turbopack: {},
};

export default nextConfig;