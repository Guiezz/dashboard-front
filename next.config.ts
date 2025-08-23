import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard-production-dc4f.up.railway.app",
        port: "",
        pathname: "/static/images/**",
      },
    ],
  },
};

export default config;
