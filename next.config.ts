import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:5000", // Your Node.js backend
  },
};

export default nextConfig;
