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

// Build indexed catalog
export const CLOUDINARY_SFX_CATALOG: CloudinarySfxAsset[] = rawSfxList
  .filter((item) => Boolean(item.secure_url))
  .map((item, index) => {
    const rawName = item.filename ? item.filename.replace(/_[a-z0-9]+$/i, '') : `sfx-${index}`;
    const role = categorizeFilename(rawName);
    return {
      id: `cld-sfx-${index}`,
      name: rawName,
      url: item.secure_url!,
      durationSec: Number(item.duration) || 0.3,
      role,
      defaultVolume: getVolumeForRole(role),
    };
  });

// Role-based lookup buckets
export const SFX_BY_ROLE: Record<SfxRole, CloudinarySfxAsset[]> = {
  DRAMATIC_HOOK: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'DRAMATIC_HOOK'),
  TRANSITION_WHOOSH: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'TRANSITION_WHOOSH'),
  UI_POP: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'UI_POP'),
  ACCENT_STAT: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'ACCENT_STAT'),
  TEXT_QUOTE: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'TEXT_QUOTE'),
  TECH_ACCENT: CLOUDINARY_SFX_CATALOG.filter((s) => s.role === 'TECH_ACCENT'),
};

/**
 * Fallback defaults if role lookup is empty
 */
export const DEFAULT_SFX_URLS: Record<SfxRole, string> = {
  DRAMATIC_HOOK: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093240/cinematic-impact_l17w47.mp3',
  TRANSITION_WHOOSH: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788092928/whoosh-swoosh_d1x9w8.mp3',
  UI_POP: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093637/pop-5_f0demv.mp3',
  ACCENT_STAT: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093521/ding-5_kovgrw.mp3',
  TEXT_QUOTE: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093409/typewriter-single_l92g46.mp3',
  TECH_ACCENT: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093245/camera-shutter_dkmg7d.mp3',
};
