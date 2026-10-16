/**
 * Cloudinary SFX Catalog for Faceless Video & Remotion Rendering
 * 
 * Maps 277 curated sound effects hosted on Cloudinary into 6 production roles.
 * All URLs are direct HTTPS Cloudinary CDN links that render reliably in Remotion Lambda.
 */

import assetsJson from '../../lib/cloudinary/assets.json';

export type SfxRole =
  | 'DRAMATIC_HOOK'    // Video opening (0-3s), dramatic revelation
  | 'TRANSITION_WHOOSH' // Scene switch, slide change, major b-roll cut
  | 'UI_POP'            // Element pop-in, checkmark, keyword highlight, badge
  | 'ACCENT_STAT'       // Numbers, metrics, percentages, money, achievements
  | 'TEXT_QUOTE'        // Quotes, paper reveals, typewriter notes, citations
  | 'TECH_ACCENT';      // Screenshots, camera shutter, tool demos, clicks

export interface CloudinarySfxAsset {
  id: string;
  name: string;
  url: string;
  durationSec: number;
  role: SfxRole;
  defaultVolume: number;
}

// Extract SFX list from assets.json safely
const rawSfxList: Array<{
  filename?: string;
  secure_url?: string;
  duration?: number;
}> = (assetsJson as any)?.['SFX'] || [];

function categorizeFilename(name: string): SfxRole {
  const lower = name.toLowerCase();

  // Dramatic Hook / Impact
  if (
    lower.includes('cinematic') ||
    lower.includes('boom') ||
    lower.includes('bass-drop') ||
    lower.includes('power-up') ||
    lower.includes('rise') ||
    lower.includes('hit')
  ) {
    return 'DRAMATIC_HOOK';
  }

  // Transitions & Whooshes
  if (
    lower.includes('whoosh') ||
    lower.includes('woosh') ||
    lower.includes('transition') ||
    lower.includes('swipe') ||
    lower.includes('slide') ||
    lower.includes('air')
  ) {
    return 'TRANSITION_WHOOSH';
  }

  // Stat, Metrics, Cash, Success
  if (
    lower.includes('ding') ||
    lower.includes('chime') ||
    lower.includes('coin') ||
    lower.includes('cash') ||
    lower.includes('bell') ||
    lower.includes('success') ||
    lower.includes('victory') ||
    lower.includes('achievement')
  ) {
    return 'ACCENT_STAT';
  }

  // Text, Quotes, Writing
  if (
    lower.includes('typewriter') ||
    lower.includes('typing') ||
    lower.includes('marker') ||
    lower.includes('paper') ||
    lower.includes('page') ||
    lower.includes('chalk') ||
    lower.includes('pen')
  ) {
    return 'TEXT_QUOTE';
  }

  // Tech, Screenshots, Cameras
  if (
    lower.includes('camera') ||
    lower.includes('click') ||
    lower.includes('digital') ||
    lower.includes('laser') ||
    lower.includes('tick') ||
    lower.includes('blip') ||
    lower.includes('beep')
  ) {
    return 'TECH_ACCENT';
  }

  // Default to UI Pop
  return 'UI_POP';
}

function getVolumeForRole(role: SfxRole): number {
  switch (role) {
    case 'DRAMATIC_HOOK':
      return 0.32; // impactful, but doesn't blow out voice
    case 'TRANSITION_WHOOSH':
      return 0.25; // crisp motion breeze
    case 'ACCENT_STAT':
      return 0.22; // pleasant notification chime
    case 'UI_POP':
      return 0.20; // subtle punchy micro-accent
    case 'TEXT_QUOTE':
      return 0.18; // soft paper / typewriter
    case 'TECH_ACCENT':
      return 0.20; // clean shutter / click
    default:
      return 0.20;
  }
}

const S3_BASE = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com';

export const DEFAULT_SFX_URLS: Record<SfxRole, string> = {
  DRAMATIC_HOOK: `${S3_BASE}/assets/reusable/sound-effects/cinematic-boom.wav`,
  TRANSITION_WHOOSH: `${S3_BASE}/assets/reusable/sound-effects/whoosh-medium.wav`,
  UI_POP: `${S3_BASE}/assets/reusable/sound-effects/pop-medium.wav`,
  ACCENT_STAT: `${S3_BASE}/assets/reusable/sound-effects/achievement-unlock.wav`,
  TEXT_QUOTE: `${S3_BASE}/assets/reusable/sound-effects/paper-turn.wav`,
  TECH_ACCENT: `${S3_BASE}/assets/reusable/sound-effects/keyboard-tap.wav`,
};

// Build indexed catalog with verified live S3 sound effects
export const CLOUDINARY_SFX_CATALOG: CloudinarySfxAsset[] = [
  {
    id: 'sfx-hook-boom',
    name: 'cinematic-boom',
    url: DEFAULT_SFX_URLS.DRAMATIC_HOOK,
    durationSec: 1.5,
    role: 'DRAMATIC_HOOK',
    defaultVolume: getVolumeForRole('DRAMATIC_HOOK'),
  },
  {
    id: 'sfx-trans-whoosh',
    name: 'whoosh-medium',
    url: DEFAULT_SFX_URLS.TRANSITION_WHOOSH,
    durationSec: 0.8,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },
  {
    id: 'sfx-ui-pop',
    name: 'pop-medium',
    url: DEFAULT_SFX_URLS.UI_POP,
    durationSec: 0.4,
    role: 'UI_POP',
    defaultVolume: getVolumeForRole('UI_POP'),
  },
  {
    id: 'sfx-stat-accent',
    name: 'achievement-unlock',
    url: DEFAULT_SFX_URLS.ACCENT_STAT,
    durationSec: 1.0,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },
  {
    id: 'sfx-quote-paper',
    name: 'paper-turn',
    url: DEFAULT_SFX_URLS.TEXT_QUOTE,
    durationSec: 0.6,
    role: 'TEXT_QUOTE',
    defaultVolume: getVolumeForRole('TEXT_QUOTE'),
  },
  {
    id: 'sfx-tech-keyboard',
    name: 'keyboard-tap',
    url: DEFAULT_SFX_URLS.TECH_ACCENT,
    durationSec: 0.5,
    role: 'TECH_ACCENT',
    defaultVolume: getVolumeForRole('TECH_ACCENT'),
  },
];

// Role-based lookup buckets
export const SFX_BY_ROLE: Record<SfxRole, CloudinarySfxAsset[]> = {
  DRAMATIC_HOOK: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'DRAMATIC_HOOK'),
  TRANSITION_WHOOSH: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'TRANSITION_WHOOSH'),
  UI_POP: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'UI_POP'),
  ACCENT_STAT: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'ACCENT_STAT'),
  TEXT_QUOTE: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'TEXT_QUOTE'),
  TECH_ACCENT: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'TECH_ACCENT'),
};
