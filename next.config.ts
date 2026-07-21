import type { NextConfig } from "next";
import packageJson from "./package.json";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // changed from true to false
  env: {
    APP_VERSION: packageJson.version,
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "zapjot",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Hides source maps from visitors
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
