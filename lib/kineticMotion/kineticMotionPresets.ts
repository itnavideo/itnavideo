/**
 * Kinetic Motion Presets & Templates
 *
 * All legacy 36 experimental styles have been completely removed.
 * Switched to reference-based Creator Templates system.
 * Active Template: 'creator-editorial' (Template #01)
 */

export type KineticMotionPresetId =
  | 'creator-editorial'
  | (string & {});

export interface KineticMotionPreset {
  id: KineticMotionPresetId;
  badge: string;
  name: string;
  vibe: string;
  tag: string;
  accentColor: string;
  previewFont: string;
  sampleWords: string[];
  previewAnimation: string;
  bridgeStyleId: string;
  animationSpec: string;
}

export const KINETIC_MOTION_PRESETS: KineticMotionPreset[] = [
  {
    id: 'creator-editorial',
    badge: 'Template #01',
    name: 'Creator Editorial',
    vibe: 'Hybrid Serif & Bold Sans (Ali Abdaal / Iman Gadzhi style)',
    tag: '🔥 Viral Creator',
    accentColor: '#FACC15',
    previewFont: 'Montserrat, sans-serif',
    sampleWords: ['AI', 'MONETIZATION', 'UPDATE'],
    previewAnimation: '',
    bridgeStyleId: 'creator-editorial',
    animationSpec: 'Multi-font typography featuring bold sans-serif keywords with elegant italic serif accents and electric yellow highlights.',
  },
];

/** Default preset ID */
export const DEFAULT_KM_PRESET_ID: KineticMotionPresetId = 'creator-editorial';

/** localStorage key */
export const KM_LAST_PRESET_KEY = 'last_used_kinetic_motion_preset';

/**
 * Returns the bridge template ID.
 */
export function getBridgeStyleId(kmPresetId: string): string {
  if (kmPresetId === 'creator-editorial' || kmPresetId.startsWith('creator-')) {
    return kmPresetId;
  }
  const preset = KINETIC_MOTION_PRESETS.find((p) => p.id === kmPresetId);
  return preset?.bridgeStyleId ?? 'creator-editorial';
}

/** Look up a preset by ID */
export function getKineticMotionPreset(id: string): KineticMotionPreset | undefined {
  return KINETIC_MOTION_PRESETS.find((p) => p.id === id);
}

/** Resolve initial preset: URL param → localStorage → default */
export function resolveInitialKMPreset(urlParam: string | null): KineticMotionPresetId {
  if (urlParam) {
    const decoded = decodeURIComponent(urlParam) as KineticMotionPresetId;
    if (decoded === 'creator-editorial' || KINETIC_MOTION_PRESETS.some((p) => p.id === decoded)) return decoded;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(KM_LAST_PRESET_KEY) as KineticMotionPresetId | null;
      if (saved && (saved === 'creator-editorial' || KINETIC_MOTION_PRESETS.some((p) => p.id === saved))) return saved;
    } catch {}
  }
  return DEFAULT_KM_PRESET_ID;
}
