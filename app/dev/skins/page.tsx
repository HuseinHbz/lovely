'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SpeakerBubble } from '@/components/ui/SpeakerBubble';
import { CoverSkin } from '@/components/skins/CoverSkin';
import { InterrogationSkin } from '@/components/skins/InterrogationSkin';
import { MapSkin } from '@/components/skins/MapSkin';
import { MindSkin } from '@/components/skins/MindSkin';
import { EndingSkin } from '@/components/skins/EndingSkin';
import { Wolf } from '@/components/art/Wolf';
import { Hedgehog } from '@/components/art/Hedgehog';
import { Panda } from '@/components/art/Panda';
import { Owl } from '@/components/art/Owl';
import { WolfCar } from '@/components/art/WolfCar';
import { FACE_STATES, FACE_LABELS, type FaceState } from '@/lib/faces';
import {
  WOLF_OUTFITS,
  WOLF_OUTFIT_LABELS,
  HEDGEHOG_OUTFITS,
  HEDGEHOG_OUTFIT_LABELS,
  type WolfOutfit,
  type HedgehogOutfit,
} from '@/lib/wardrobe';

/** پیش‌نمایش پنج اسکین و آرت‌ورک. فقط در development. */

function Frame({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-lg font-bold text-tigh">{title}</h2>
        <p className="text-sm text-jooheh-text">{note}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-jooheh/30">{children}</div>
    </section>
  );
}

export default function DevSkinsPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  const [face, setFace] = useState<FaceState>('neutral');
  const [wolfOutfit, setWolfOutfit] = useState<WolfOutfit>('formal');
  const [hedgehogOutfit, setHedgehogOutfit] = useState<HedgehogOutfit>('nurse');

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-safe py-12">
      <header>
        <p className="font-ui text-xs tracking-[0.04em] text-jooheh-text">فقط در development</p>
        <h1 className="font-display text-2xl font-bold">پنج اسکین</h1>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-bold text-tigh">شخصیت‌ها و حالت چهره</h2>
        <div className="flex flex-wrap gap-2">
          {FACE_STATES.map((state) => (
            <Button
              key={state}
              variant={face === state ? 'solid' : 'outline'}
              onClick={() => setFace(state)}
            >
              {FACE_LABELS[state]}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {WOLF_OUTFITS.map((item) => (
            <Button
              key={item}
              variant={wolfOutfit === item ? 'solid' : 'outline'}
              onClick={() => setWolfOutfit(item)}
            >
              گرگ: {WOLF_OUTFIT_LABELS[item]}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {HEDGEHOG_OUTFITS.map((item) => (
            <Button
              key={item}
              variant={hedgehogOutfit === item ? 'solid' : 'outline'}
              onClick={() => setHedgehogOutfit(item)}
            >
              جوجه‌تیغی: {HEDGEHOG_OUTFIT_LABELS[item]}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-8">
          <figure className="flex flex-col items-center gap-2">
            <Wolf face={face} outfit={wolfOutfit} className="w-36" />
            <figcaption className="font-ui text-xs text-jooheh-text">گرگ</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <Hedgehog face={face} outfit={hedgehogOutfit} className="w-36" />
            <figcaption className="font-ui text-xs text-jooheh-text">جوجه‌تیغی</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <Panda className="w-24" />
            <figcaption className="font-ui text-xs text-jooheh-text">پاندا (نازو)</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <Owl className="w-24" />
            <figcaption className="font-ui text-xs text-jooheh-text">جغد رئیس</figcaption>
          </figure>
        </div>
        <p className="text-sm text-jooheh-text">
          بدن یک‌بار رندر می‌شود و فقط گروه صورت عوض می‌شود — بدون بارگذاری دوباره.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-tigh">ماشین گرگ</h2>
        <WolfCar className="w-full max-w-md" />
        <p className="text-sm text-jooheh-text">
          شاسی‌بلند مشکی؛ از پشت شیشه لپ‌تاپ، قهوه، عینک و کابل شارژ پیداست.
        </p>
      </section>

      <Frame title="۱ — جلد پرونده" note="مه دولایه، ماه، دو ردپا، مُهر محرمانه">
        <CoverSkin>
          <Button variant="solid">پرونده را باز کن؛ مسئولیتش با خودم</Button>
        </CoverSkin>
      </Frame>

      <Frame title="۲ — اتاق بازجویی" note="گرگ راست، جوجه‌تیغی چپ؛ در موبایل بالای کارت">
        <div className="bg-shab p-4">
          <InterrogationSkin
            wolfFace={face}
            hedgehogFace={face}
            wolfOutfit={wolfOutfit}
            hedgehogOutfit={hedgehogOutfit}
          >
            <Card label="پرونده‌ی محرمانه شماره ۲۷" title="معرفی گرگ">
              <div className="flex flex-col gap-3">
                <SpeakerBubble name="پاندا" side="center">
                  آیا او پسر خوبی است؟
                </SpeakerBubble>
                <SpeakerBubble name="گرگ" side="start">
                  من آدم آرومی‌ام.
                </SpeakerBubble>
              </div>
            </Card>
          </InterrogationSkin>
        </div>
      </Frame>

      <Frame title="۳ — نقشه‌ی جنگل" note="نه نقطه، پین خاموش و روشن، بزرگ‌نمایی با دکمه">
        <div className="bg-shab p-4">
          <MapSkin unlocked={['bimarestan', 'boulevard', 'travel-mug']} />
        </div>
      </Frame>

      <Frame title="۴ — ذهن جوجه‌تیغی" note="پالت به کاج روشن‌تر می‌رود، مه کنار می‌رود">
        <div className="bg-shab p-4">
          <MindSkin>
            <Card title="سؤال بزرگ گرگ">
              <SpeakerBubble name="گرگ" side="start">
                هدفت از دوباره پیام دادن چیه؟
              </SpeakerBubble>
            </Card>
          </MindSkin>
        </div>
      </Frame>

      <Frame title="۵ — پایان باز" note="صبح؛ تنها جایی که پس‌زمینه شب نیست">
        <EndingSkin>
          <div className="flex w-full max-w-card flex-col gap-3">
            <Button variant="solid">یک بستنی، بدون عنوان</Button>
            <Button variant="outline">بذار یکم فکر کنم</Button>
            <Button variant="outline">فعلاً نازو رو بغل کنیم</Button>
          </div>
        </EndingSkin>
      </Frame>
    </main>
  );
}
