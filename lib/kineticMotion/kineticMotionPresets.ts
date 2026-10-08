/**
 * Kinetic Motion Presets — Phase 1 config
 *
 * 11 numbered presets (#KM-01 → #KM-11) with:
 * - CSS micro-preview spec (used for lightweight card animation in the studio)
 * - Backend bridge: maps each KM preset to the best-matching existing TypographyStyleId
 *   so Lambda renders NEVER fail while Phase 2 Remotion compositions are being built.
 *
 * Phase 2: replace bridgeStyleId with the dedicated Remotion composition ID once built.
 * Each animation module must have a try/catch fallback to 'apple-keynote-punch' (safe baseline).
 */

export type KineticMotionPresetId =
  | 'km-01-slam'
  | 'km-02-elastic-bounce'
  | 'km-03-word-cascade'
  | 'km-04-cinematic-flip'
  | 'km-05-masked-slide'
  | 'km-06-glitch-scramble'
  | 'km-07-typewriter-cursor'
  | 'km-08-particle-burst'
  | 'km-09-highlighter-sweep'
  | 'km-10-zoom-through'
  | 'km-11-fluid-wave';

export interface KineticMotionPreset {
  id: KineticMotionPresetId;
  /** Badge label shown on card — #KM-01, #KM-02, … */
  badge: string;
  /** Short display name */
  name: string;
  /** One-line vibe description */
  vibe: string;
  /** Category tag */
  tag: string;
  /** Accent color used in micro-preview & card highlight */
  accentColor: string;
  /** Font used in micro-preview */
  previewFont: string;
  /**
   * CSS animation class(es) applied to the micro-preview words.
   * These are pure Tailwind + inline-style animations — no video files.
   */
  previewAnimation: string;
  /**
   * Phase 1 bridge: existing TypographyStyleId to use on Lambda until
   * the dedicated KM Remotion composition is built in Phase 2.
   * SAFE BASELINE fallback: 'apple-keynote-punch'
   */
  bridgeStyleId: string;
  /** Human-readable description of the animation for Phase 2 engineers */
  animationSpec: string;
}

export const KINETIC_MOTION_PRESETS: KineticMotionPreset[] = [
  {
    id: 'km-01-slam',
    badge: '#KM-01',
    name: 'Slam Impact',
    vibe: 'High-energy hook, loud statements',
    tag: '🔥 Viral',
    accentColor: '#EF4444',
    previewFont: 'Impact, sans-serif',
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'apple-keynote-punch',   // closest existing: big punch scale
    animationSpec: 'scale(2.5)→scale(1.0) + 2px micro-shake on land. Instant snap on spoken beat.',
  },
  {
    id: 'km-02-elastic-bounce',
    badge: '#KM-02',
    name: 'Elastic Bounce',
    vibe: 'Playful, conversational podcast clips',
    tag: '⚡ Kinetic',
    accentColor: '#FF6D00',
    previewFont: 'Montserrat, sans-serif',
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'multi-line-block-slam', // overshoot + rubber-band closest match
    animationSpec: 'cubic-bezier(0.175,0.885,0.32,1.275) overshoot spring. Words pop in with rubber-band retract.',
  },
  {
    id: 'km-03-word-cascade',
    badge: '#KM-03',
    name: 'Word Cascade',
    vibe: 'Fast speakers, rapid-fire talking heads',
    tag: '⚡ Kinetic',
    accentColor: '#FACC15',
    previewFont: 'Inter, sans-serif',
    previewAnimation: 'animate-km-cascade',
    bridgeStyleId: 'vox-giant-stagger',    // push-replace stagger is closest
    animationSpec: 'New word enters from bottom-right, pushes previous word out of fixed focal box.',
  },
  {
    id: 'km-04-cinematic-flip',
    badge: '#KM-04',
    name: 'Cinematic 3D Flip',
    vibe: 'Tech reviews, luxury brands, documentary',
    tag: '🎬 Cinematic',
    accentColor: '#D9B76E',
    previewFont: 'Georgia, serif',
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'isometric-3d-flythrough', // 3D depth closest match
    animationSpec: 'perspective(600px) rotateX(-90deg)→rotateX(0deg) with motion blur. Per-word stagger 40ms.',
  },
  {
    id: 'km-05-masked-slide',
    badge: '#KM-05',
    name: 'Masked Slide',
    vibe: 'Clean, premium, Apple aesthetic storytelling',
    tag: '💎 Minimal',
    accentColor: '#FFFFFF',
    previewFont: 'Inter, sans-serif',
    previewAnimation: 'animate-km-slide',
    bridgeStyleId: 'editorial-magazine-manifesto', // masked reveal closest
    animationSpec: 'translateY(100%)→translateY(0) behind overflow:hidden clip-path. cubic-bezier(0.16,1,0.3,1) deceleration.',
  },
  {
    id: 'km-06-glitch-scramble',
    badge: '#KM-06',
    name: 'Glitch Scramble',
    vibe: 'Coding, AI, crypto, futuristic themes',
    tag: '🤖 Cyber',
    accentColor: '#22C55E',
    previewFont: 'Courier New, monospace',
    previewAnimation: 'animate-km-glitch',
    bridgeStyleId: 'glitch-cyber-rave',    // exact match for cyber glitch aesthetic
    animationSpec: '150ms random ASCII cycle before snapping to correct letters. Rapid character scramble on entry.',
  },
  {
    id: 'km-07-typewriter-cursor',
    badge: '#KM-07',
    name: 'Typewriter Cursor',
    vibe: 'Storytelling, finance, journal reflections',
    tag: '📝 Minimal',
    accentColor: '#38BDF8',
    previewFont: 'Courier New, monospace',
    previewAnimation: 'animate-km-typewriter',
    bridgeStyleId: 'swiss-minimal',        // clean monospace typewriter closest
    animationSpec: 'Character-by-character typed output synced to audio timestamp. Blinking cursor block | between words.',
  },
  {
    id: 'km-08-particle-burst',
    badge: '#KM-08',
    name: 'Particle Burst',
    vibe: 'Emotional peaks, punchlines, revelation moments',
    tag: '🔥 Viral',
    accentColor: '#A855F7',
    previewFont: 'Montserrat, sans-serif',
    previewAnimation: 'animate-km-burst',
    bridgeStyleId: 'split-color-invert',   // scale explosion + contrast closest
    animationSpec: 'scale(0.5)→scale(1.3)→scale(1.0) with radial particle flash outline strokes on impact.',
  },
  {
    id: 'km-09-highlighter-sweep',
    badge: '#KM-09',
    name: 'Highlighter Sweep',
    vibe: 'Educational, breakdown, tutorial reels',
    tag: '🎓 Educational',
    accentColor: '#FACC15',
    previewFont: 'Inter, sans-serif',
    previewAnimation: 'animate-km-highlight',
    bridgeStyleId: 'creator-highlight',    // highlight bar closest match
    animationSpec: 'Rectangular highlight bar sweeps width(0)→width(100%) behind active word in sync with voice.',
  },
  {
    id: 'km-10-zoom-through',
    badge: '#KM-10',
    name: 'Zoom Through',
    vibe: 'Dramatic scene shifts, climax sentences',
    tag: '🎬 Cinematic',
    accentColor: '#FF6D00',
    previewFont: 'Impact, sans-serif',
    previewAnimation: 'animate-km-zoom',
    bridgeStyleId: 'kinetic-marquee-diagonal', // forward zoom movement closest
    animationSpec: 'scale(1.0)→scale(8.0) with opacity fade-out at 80% scale, seamlessly cuts to next phrase.',
  },
  {
    id: 'km-11-fluid-wave',
    badge: '#KM-11',
    name: 'Fluid Wave',
    vibe: 'Calm, lifestyle, travel, reflective reels',
    tag: '🌊 Lifestyle',
    accentColor: '#38BDF8',
    previewFont: 'Georgia, serif',
    previewAnimation: 'animate-km-wave',
    bridgeStyleId: 'nordic-clean',         // calm, minimal float closest
    animationSpec: 'y = sin(t + i * 0.4) sinusoidal float per character. Continuous gentle liquid wave.',
  },
];

/** Default preset ID used when localStorage is empty */
export const DEFAULT_KM_PRESET_ID: KineticMotionPresetId = 'km-01-slam';

/** localStorage key for last-used Kinetic Motion preset */
export const KM_LAST_PRESET_KEY = 'last_used_kinetic_motion_preset';

/**
 * Returns the Phase 1 bridge TypographyStyleId for a given KM preset.
 * Falls back to the safe baseline 'apple-keynote-punch' if preset not found.
 */
export function getBridgeStyleId(kmPresetId: string): string {
  const preset = KINETIC_MOTION_PRESETS.find((p) => p.id === kmPresetId);
  return preset?.bridgeStyleId ?? 'apple-keynote-punch';
}

/** Look up a preset by ID, returning undefined if not found */
export function getKineticMotionPreset(id: string): KineticMotionPreset | undefined {
  return KINETIC_MOTION_PRESETS.find((p) => p.id === id);
}

/** Resolve initial preset: URL param → localStorage → default */
export function resolveInitialKMPreset(urlParam: string | null): KineticMotionPresetId {
  if (urlParam) {
    const decoded = decodeURIComponent(urlParam) as KineticMotionPresetId;
    if (KINETIC_MOTION_PRESETS.some((p) => p.id === decoded)) return decoded;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(KM_LAST_PRESET_KEY) as KineticMotionPresetId | null;
      if (saved && KINETIC_MOTION_PRESETS.some((p) => p.id === saved)) return saved;
    } catch {}
  }
  return DEFAULT_KM_PRESET_ID;
}
