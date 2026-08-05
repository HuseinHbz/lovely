'use client';

import type { ReactNode } from 'react';
import type { SkinId } from '@/content/schema';
import type { FaceState } from '@/components/art/faces';
import type { HedgehogOutfit, WolfOutfit } from '@/lib/wardrobe';
import { InterrogationSkin } from './InterrogationSkin';
import { MapSkin } from './MapSkin';
import { MindSkin } from './MindSkin';
import { EndingSkin } from './EndingSkin';
import { CoverSkin } from './CoverSkin';

/**
 * کارت مرحله را داخل اسکین خودش می‌گذارد.
 *
 * انتخاب اسکین کاملاً از `stage.skin` می‌آید، پس عوض کردن فضای یک مرحله فقط
 * یک کلمه در فایل محتواست و هیچ کد UI ای دست نمی‌خورد.
 */
export function SkinFrame({
  skin,
  children,
  unlocked = [],
  wolfFace = 'neutral',
  hedgehogFace = 'neutral',
  wolfOutfit = 'formal',
  hedgehogOutfit = 'nurse',
}: {
  skin: SkinId;
  children: ReactNode;
  unlocked?: readonly string[];
  wolfFace?: FaceState;
  hedgehogFace?: FaceState;
  wolfOutfit?: WolfOutfit;
  hedgehogOutfit?: HedgehogOutfit;
}) {
  switch (skin) {
    case 'cover':
      return <CoverSkin>{children}</CoverSkin>;
    case 'map':
      return <MapSkin unlocked={unlocked}>{children}</MapSkin>;
    case 'mind':
      return <MindSkin>{children}</MindSkin>;
    case 'ending':
      return <EndingSkin>{children}</EndingSkin>;
    case 'interrogation':
      return (
        <InterrogationSkin
          wolfFace={wolfFace}
          hedgehogFace={hedgehogFace}
          wolfOutfit={wolfOutfit}
          hedgehogOutfit={hedgehogOutfit}
        >
          {children}
        </InterrogationSkin>
      );
  }
}
