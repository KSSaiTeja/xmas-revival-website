import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@neondatabase/serverless"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "awesome-coding.com",
        port: "",
        pathname: "/theme/images/**",
      },
    ],
  },
};

export default nextConfig;
