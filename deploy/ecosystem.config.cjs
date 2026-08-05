/**
 * پیکربندی PM2.
 *
 * مقادیر از محیط خوانده می‌شوند تا این فایل هم مستقیم در مخزن قابل استفاده
 * باشد (`pm2 start deploy/ecosystem.config.cjs`) و هم `install.sh` بتواند
 * نسخه‌ی نهایی را با مقادیر واقعی در `<dir>/shared/` بنویسد.
 *
 * `cwd` عمداً روی `current` است که یک symlink است: `update.sh` بعد از build
 * موفق فقط symlink را جابه‌جا می‌کند و `pm2 reload` کد تازه را برمی‌دارد،
 * بدون قطعی.
 */

const dir = process.env.WH_DIR || '/var/www/wolf-hedgehog';
const port = Number(process.env.WH_PORT || 3000);
const user = process.env.WH_USER || 'wolfapp';

module.exports = {
  apps: [
    {
      name: 'wolf-hedgehog',
      cwd: `${dir}/current`,
      script: `${dir}/current/node_modules/next/dist/bin/next`,
      args: `start -p ${port}`,
      interpreter: 'node',

      // یک نمونه، عمدی.
      //
      // `lib/rate-limit.ts` شمارنده‌ی تلاش ناموفق را در حافظه‌ی همان پروسه
      // نگه می‌دارد. با چند نمونه، هر کدام شمارنده‌ی خودش را می‌داشت و سقف
      // ۱۰ تلاش عملاً چند برابر می‌شد. برای سایتی با یک کاربر، یک نمونه هم
      // از نظر بار کافی است.
      instances: 1,
      exec_mode: 'fork',

      user,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '20s',
      max_memory_restart: '400M',

      env: {
        NODE_ENV: 'production',
        PORT: String(port),
        NEXT_TELEMETRY_DISABLED: '1',
      },

      // ---------------------------------------------------------------
      // لاگ‌ها فقط خطا.
      //
      // قاعده ۲ و صفحه‌ی /about-this: هیچ‌جا نباید نوشته شود کاربر کدام
      // برگه را باز کرده. لاگ خروجی استاندارد Next هر درخواست را با مسیر
      // می‌نویسد، پس `out_file` خاموش است و فقط خطا نگه داشته می‌شود —
      // همان کاری که `access_log off` در Nginx می‌کند.
      // ---------------------------------------------------------------
      out_file: '/dev/null',
      error_file: `${dir}/shared/logs/error.log`,
      merge_logs: true,
      time: true,
    },
  ],
};
