import type { NextConfig } from 'next';

const NOINDEX = 'noindex, nofollow, noarchive, nosnippet';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // لینت در CI و pre-commit اجرا می‌شود، نه داخل build.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // لایه‌ی سوم جلوگیری از ایندکس. لایه‌ی چهارم در Nginx است، چون اگر
          // روزی جلوی Next چیز دیگری نشست، هدر باید همچنان بیرون برود.
          { key: 'X-Robots-Tag', value: NOINDEX },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
