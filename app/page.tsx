import { redirect } from 'next/navigation';

/**
 * ریشه‌ی سایت.
 *
 * دروازه کار middleware است، نه اینجا: بدون کوکی معتبر این درخواست اصلاً به
 * این کامپوننت نمی‌رسد و به `/gate` می‌رود. پس اگر به اینجا رسیدیم یعنی
 * کوکی هست و فقط باید کاربر را سر جای خودش در پرونده بگذاریم.
 */
export default function HomePage() {
  redirect('/story');
}
