import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "comicvine.gamespot.com",
      },
      {
        protocol: "https",
        hostname: "www.comicvine.com",
      },
      {
        protocol: "http",
        hostname: "i.annihil.us",
      },
      {
        protocol: "https",
        hostname: "i.annihil.us",
      },
    ],
  },
};

export default nextConfig;
