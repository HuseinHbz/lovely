import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // قاعده ۲: هیچ تله‌متری. Next به‌صورت پیش‌فرض telemetry دارد؛ اینجا خاموش می‌شود
  // (متغیر NEXT_TELEMETRY_DISABLED در .env.example هم ست شده است).
  eslint: {
    // لینت در CI و pre-commit اجرا می‌شود، نه داخل build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
