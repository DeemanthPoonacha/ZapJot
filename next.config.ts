import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // changed from true to false
  env: {
    APP_VERSION: packageJson.version,
  },
};

export default nextConfig;
