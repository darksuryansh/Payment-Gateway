import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
      // Proxy hosted payment pages (EJS) served by Express
      {
        source: "/pay/:path*",
        destination: `${API_URL}/pay/:path*`,
      },
      // Proxy static assets used by EJS templates
      {
        source: "/static/:path*",
        destination: `${API_URL}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;
