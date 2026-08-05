import type { Metadata, Viewport } from 'next';
import { InkBleedDefs } from '@/components/motion/InkBleed';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { THEME_COLOR } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'پرونده‌ی محرمانه شماره ۲۷',
  description: 'یک پرونده‌ی شبانه در جنگل.',
  // قاعده‌ی حریم خصوصی: این سایت هرگز نباید ایندکس شود (فاز ۵ هدر و robots.txt را اضافه می‌کند).
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <InkBleedDefs />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
