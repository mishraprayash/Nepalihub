import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/horoscope/:sign",
        destination: "https://ohmanda.com/api/horoscope/:sign/",
      },
    ];
  },
};

export default nextConfig;
