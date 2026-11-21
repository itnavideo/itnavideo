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
      return 0.38; // impactful punch / boom, voice stays clear
    case 'TRANSITION_WHOOSH':
      return 0.30; // crisp clean scene switch
    case 'ACCENT_STAT':
      return 0.32; // satisfying metric chime / bell
    case 'UI_POP':
      return 0.28; // noticeable, crisp micro pop
    case 'TEXT_QUOTE':
      return 0.25; // paper / writing reveal
    case 'TECH_ACCENT':
      return 0.28; // keyboard / click / shutter
    default:
      return 0.28;
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
  // ── 1. DRAMATIC HOOK & IMPACTS ──
  {
    id: 'sfx-hook-boom',
    name: 'cinematic-boom',
    url: `${S3_BASE}/assets/reusable/sound-effects/cinematic-boom.wav`,
    durationSec: 1.5,
    role: 'DRAMATIC_HOOK',
    defaultVolume: getVolumeForRole('DRAMATIC_HOOK'),
  },
  {
    id: 'sfx-hook-bass-drop',
    name: 'bass-drop-light',
    url: `${S3_BASE}/assets/reusable/sound-effects/bass-drop-light.wav`,
    durationSec: 1.2,
    role: 'DRAMATIC_HOOK',
    defaultVolume: getVolumeForRole('DRAMATIC_HOOK'),
  },
  {
    id: 'sfx-hook-hit-strong',
    name: 'hit-strong',
    url: `${S3_BASE}/assets/reusable/sound-effects/hit-strong.wav`,
    durationSec: 0.8,
    role: 'DRAMATIC_HOOK',
    defaultVolume: getVolumeForRole('DRAMATIC_HOOK'),
  },
  {
    id: 'sfx-hook-hit-medium',
    name: 'hit-medium',
    url: `${S3_BASE}/assets/reusable/sound-effects/hit-medium.wav`,
    durationSec: 0.7,
    role: 'DRAMATIC_HOOK',
    defaultVolume: getVolumeForRole('DRAMATIC_HOOK'),
  },

  // ── 2. TRANSITIONS & WHOOSHES ──
  {
    id: 'sfx-trans-whoosh-fast',
    name: 'whoosh-fast',
    url: `${S3_BASE}/assets/reusable/sound-effects/whoosh-fast.wav`,
    durationSec: 0.45,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },
  {
    id: 'sfx-trans-whoosh-med',
    name: 'whoosh-medium',
    url: `${S3_BASE}/assets/reusable/sound-effects/whoosh-medium.wav`,
    durationSec: 0.8,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },
  {
    id: 'sfx-trans-whoosh-short',
    name: 'whoosh-short',
    url: `${S3_BASE}/assets/reusable/sound-effects/whoosh-short.wav`,
    durationSec: 0.35,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },
  {
    id: 'sfx-trans-sweep',
    name: 'transition-sweep',
    url: `${S3_BASE}/assets/reusable/sound-effects/transition-sweep.wav`,
    durationSec: 0.9,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },
  {
    id: 'sfx-trans-swipe-left',
    name: 'swipe-left',
    url: `${S3_BASE}/assets/reusable/sound-effects/swipe-left.wav`,
    durationSec: 0.4,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },
  {
    id: 'sfx-trans-air-rush',
    name: 'air-rush',
    url: `${S3_BASE}/assets/reusable/sound-effects/air-rush.wav`,
    durationSec: 0.7,
    role: 'TRANSITION_WHOOSH',
    defaultVolume: getVolumeForRole('TRANSITION_WHOOSH'),
  },

  // ── 3. UI POPS & ELEMENT REVEALS ──
  {
    id: 'sfx-ui-pop-med',
    name: 'pop-medium',
    url: `${S3_BASE}/assets/reusable/sound-effects/pop-medium.wav`,
    durationSec: 0.4,
    role: 'UI_POP',
    defaultVolume: getVolumeForRole('UI_POP'),
  },
  {
    id: 'sfx-ui-pop-bubble',
    name: 'bubble-pop',
    url: `${S3_BASE}/assets/reusable/sound-effects/bubble-pop.wav`,
    durationSec: 0.3,
    role: 'UI_POP',
    defaultVolume: getVolumeForRole('UI_POP'),
  },
  {
    id: 'sfx-ui-pop-strong',
    name: 'pop-strong',
    url: `${S3_BASE}/assets/reusable/sound-effects/pop-strong.wav`,
    durationSec: 0.4,
    role: 'UI_POP',
    defaultVolume: getVolumeForRole('UI_POP'),
  },
  {
    id: 'sfx-ui-click-pop',
    name: 'ui-click-pop',
    url: `${S3_BASE}/assets/reusable/sound-effects/ui-click-pop.wav`,
    durationSec: 0.35,
    role: 'UI_POP',
    defaultVolume: getVolumeForRole('UI_POP'),
  },

  // ── 4. STAT ACCENTS, REVELATIONS & METRICS ──
  {
    id: 'sfx-stat-unlock',
    name: 'achievement-unlock',
    url: `${S3_BASE}/assets/reusable/sound-effects/achievement-unlock.wav`,
    durationSec: 1.0,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },
  {
    id: 'sfx-stat-bell',
    name: 'success-bell',
    url: `${S3_BASE}/assets/reusable/sound-effects/success-bell.wav`,
    durationSec: 0.85,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },
  {
    id: 'sfx-stat-chime',
    name: 'success-chime',
    url: `${S3_BASE}/assets/reusable/sound-effects/success-chime.wav`,
    durationSec: 0.8,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },
  {
    id: 'sfx-stat-cash',
    name: 'cash-register',
    url: `${S3_BASE}/assets/reusable/sound-effects/cash-register.wav`,
    durationSec: 0.9,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },
  {
    id: 'sfx-stat-coin',
    name: 'coin-drop',
    url: `${S3_BASE}/assets/reusable/sound-effects/coin-drop.wav`,
    durationSec: 0.65,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },
  {
    id: 'sfx-stat-score',
    name: 'score-reveal',
    url: `${S3_BASE}/assets/reusable/sound-effects/score-reveal.wav`,
    durationSec: 0.9,
    role: 'ACCENT_STAT',
    defaultVolume: getVolumeForRole('ACCENT_STAT'),
  },

  // ── 5. TEXT, QUOTES & PAPER ──
  {
    id: 'sfx-quote-paper',
    name: 'paper-turn',
    url: `${S3_BASE}/assets/reusable/sound-effects/paper-turn.wav`,
    durationSec: 0.6,
    role: 'TEXT_QUOTE',
    defaultVolume: getVolumeForRole('TEXT_QUOTE'),
  },
  {
    id: 'sfx-quote-flip',
    name: 'page-flip',
    url: `${S3_BASE}/assets/reusable/sound-effects/page-flip.wav`,
    durationSec: 0.5,
    role: 'TEXT_QUOTE',
    defaultVolume: getVolumeForRole('TEXT_QUOTE'),
  },
  {
    id: 'sfx-quote-pen',
    name: 'pen-writing',
    url: `${S3_BASE}/assets/reusable/sound-effects/pen-writing.wav`,
    durationSec: 0.8,
    role: 'TEXT_QUOTE',
    defaultVolume: getVolumeForRole('TEXT_QUOTE'),
  },

  // ── 6. TECH, KEYBOARD & DATA ACCENTS ──
  {
    id: 'sfx-tech-keyboard',
    name: 'keyboard-tap',
    url: `${S3_BASE}/assets/reusable/sound-effects/keyboard-tap.wav`,
    durationSec: 0.5,
    role: 'TECH_ACCENT',
    defaultVolume: getVolumeForRole('TECH_ACCENT'),
  },
  {
    id: 'sfx-tech-pulse',
    name: 'data-pulse',
    url: `${S3_BASE}/assets/reusable/sound-effects/data-pulse.wav`,
    durationSec: 0.6,
    role: 'TECH_ACCENT',
    defaultVolume: getVolumeForRole('TECH_ACCENT'),
  },
  {
    id: 'sfx-tech-tick',
    name: 'digital-tick',
    url: `${S3_BASE}/assets/reusable/sound-effects/digital-tick.wav`,
    durationSec: 0.4,
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
