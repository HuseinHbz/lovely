'use client';

/**
 * افکت‌های صوتی کوتاه — مُهر، ورق کاغذ، پین نقشه.
 *
 * **هیچ فایل صوتی‌ای وجود ندارد.** هر سه صدا در همان لحظه با WebAudio ساخته
 * می‌شوند. دلیلش دو چیز است:
 *
 *   ۱. قاعده‌ی شبکه: سایت روی سرور ایران بالا می‌آید و هیچ‌چیز نباید از بیرون
 *      بیاید. صدای ساخته‌شده صفر بایت دانلود دارد و `audit-privacy.sh` را هم
 *      سبز نگه می‌دارد، چون هیچ `url()` و هیچ درخواستی اضافه نمی‌شود.
 *   ۲. سه صدای کوتاه به‌صورت فایل حدود ۳۰ تا ۶۰ کیلوبایت می‌شد؛ اینجا صفر است.
 *
 * `AudioContext` تا اولین پخش ساخته نمی‌شود. مرورگرها پخش خودکار را بلاک
 * می‌کنند و چون پیش‌فرض صدا خاموش است، اولین پخش همیشه بعد از یک کلیک کاربر
 * اتفاق می‌افتد.
 */

export type SoundName = 'stamp' | 'paper' | 'pin';

let context: AudioContext | undefined;

function audioContext(): AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  if (context !== undefined) return context;

  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (Ctor === undefined) return undefined;

  context = new Ctor();
  return context;
}

/** نویز سفید کوتاه — پایه‌ی صدای کاغذ و بخش کوبه‌ای مُهر. */
function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playStamp(ctx: AudioContext, now: number): void {
  // کوبه‌ی چوب روی کاغذ: یک ضربه‌ی نویزی کوتاه + افت سریع یک سینوس بم.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, 0.09);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(1400, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.09);

  const thud = ctx.createOscillator();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(190, now);
  thud.frequency.exponentialRampToValueAtTime(60, now + 0.12);

  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.28, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  thud.connect(thudGain).connect(ctx.destination);
  thud.start(now);
  thud.stop(now + 0.14);
}

function playPaper(ctx: AudioContext, now: number): void {
  // ورق خوردن کاغذ: نویز باندگذر که فرکانسش بالا می‌رود.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, 0.22);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(0.8, now);
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(4200, now + 0.2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.22);
}

function playPin(ctx: AudioContext, now: number): void {
  // سوزن روی نقشه: یک بلیپ کوتاه و روشن.
  const blip = ctx.createOscillator();
  blip.type = 'triangle';
  blip.frequency.setValueAtTime(880, now);
  blip.frequency.exponentialRampToValueAtTime(1650, now + 0.06);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  blip.connect(gain).connect(ctx.destination);
  blip.start(now);
  blip.stop(now + 0.08);
}

/**
 * یک افکت را پخش می‌کند.
 *
 * `enabled` را فراخوان می‌دهد (از `soundOn` در استور). اگر خاموش باشد هیچ
 * `AudioContext` ای هم ساخته نمی‌شود — یعنی سایت با صدای خاموش حتی یک شیء صوتی
 * هم نمی‌سازد.
 */
export function playSound(name: SoundName, enabled: boolean): void {
  if (!enabled) return;

  const ctx = audioContext();
  if (ctx === undefined) return;

  // بعضی مرورگرها کانتکست را معلق می‌کنند تا اولین تعامل کاربر.
  if (ctx.state === 'suspended') void ctx.resume();

  const now = ctx.currentTime;
  try {
    if (name === 'stamp') playStamp(ctx, now);
    else if (name === 'paper') playPaper(ctx, now);
    else playPin(ctx, now);
  } catch {
    // صدا هیچ‌وقت نباید داستان را متوقف کند.
  }
}
