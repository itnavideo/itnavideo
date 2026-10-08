/**
 * Cinematic Motion Preset System (Strategy C)
 *
 * Shared motion definitions consumed by all Remotion templates.
 * Each preset defines camera movement as interpolation keyframes
 * that templates apply via Remotion's `interpolate()` and `spring()`.
 */

export type MotionKeyframe = {
  progress: number; // 0–1
  translateX?: number;
  translateY?: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
};

export type MotionPresetConfig = {
  id: string;
  label: string;
  keyframes: MotionKeyframe[];
  easing: 'linear' | 'ease-in-out' | 'spring' | 'ease-out';
  durationMultiplier?: number;
};

export type TransitionPresetConfig = {
  id: string;
  label: string;
  durationFrames: number;
  type: 'opacity' | 'slide' | 'scale' | 'wipe';
  direction?: 'left' | 'right' | 'up' | 'down';
  easing: 'linear' | 'ease-in-out' | 'spring';
};

// ── Camera Motion Presets ─────────────────────────────────────────────────────

export const MOTION_PRESETS: Record<string, MotionPresetConfig> = {
  slow_zoom_in: {
    id: 'slow_zoom_in',
    label: 'Slow Zoom In',
    keyframes: [
      { progress: 0, scale: 1.0 },
      { progress: 1, scale: 1.08 },
    ],
    easing: 'ease-in-out',
  },
  slow_zoom_out: {
    id: 'slow_zoom_out',
    label: 'Slow Zoom Out',
    keyframes: [
      { progress: 0, scale: 1.06 },
      { progress: 1, scale: 1.0 },
    ],
    easing: 'ease-in-out',
  },
  pan_right_ease: {
    id: 'pan_right_ease',
    label: 'Pan Right',
    keyframes: [
      { progress: 0, translateX: -20, scale: 1.04 },
      { progress: 1, translateX: 20, scale: 1.04 },
    ],
    easing: 'ease-in-out',
  },
  pan_left_ease: {
    id: 'pan_left_ease',
    label: 'Pan Left',
    keyframes: [
      { progress: 0, translateX: 20, scale: 1.04 },
      { progress: 1, translateX: -20, scale: 1.04 },
    ],
    easing: 'ease-in-out',
  },
  dolly_forward: {
    id: 'dolly_forward',
    label: 'Dolly Forward',
    keyframes: [
      { progress: 0, scale: 1.0, translateY: 8 },
      { progress: 1, scale: 1.12, translateY: -4 },
    ],
    easing: 'ease-out',
  },
  dolly_backward: {
    id: 'dolly_backward',
    label: 'Dolly Backward',
    keyframes: [
      { progress: 0, scale: 1.1, translateY: -4 },
      { progress: 1, scale: 1.0, translateY: 6 },
    ],
    easing: 'ease-in-out',
  },
  static_breathe: {
    id: 'static_breathe',
    label: 'Static Breathe',
    keyframes: [
      { progress: 0, scale: 1.0 },
      { progress: 0.5, scale: 1.012 },
      { progress: 1, scale: 1.0 },
    ],
    easing: 'ease-in-out',
  },
  ken_burns_tl_br: {
    id: 'ken_burns_tl_br',
    label: 'Ken Burns TL→BR',
    keyframes: [
      { progress: 0, translateX: -12, translateY: -8, scale: 1.06 },
      { progress: 1, translateX: 12, translateY: 8, scale: 1.0 },
    ],
    easing: 'ease-in-out',
  },
  ken_burns_br_tl: {
    id: 'ken_burns_br_tl',
    label: 'Ken Burns BR→TL',
    keyframes: [
      { progress: 0, translateX: 12, translateY: 8, scale: 1.06 },
      { progress: 1, translateX: -12, translateY: -8, scale: 1.0 },
    ],
    easing: 'ease-in-out',
  },
  scale_pop: {
    id: 'scale_pop',
    label: 'Scale Pop',
    keyframes: [
      { progress: 0, scale: 0.92, opacity: 0.7 },
      { progress: 0.15, scale: 1.04, opacity: 1 },
      { progress: 0.3, scale: 1.0, opacity: 1 },
      { progress: 1, scale: 1.0, opacity: 1 },
    ],
    easing: 'spring',
  },
  parallax_layers: {
    id: 'parallax_layers',
    label: 'Parallax Layers',
    keyframes: [
      { progress: 0, translateX: -6, translateY: 4, scale: 1.03 },
      { progress: 0.5, translateX: 6, translateY: -2, scale: 1.05 },
      { progress: 1, translateX: -3, translateY: 2, scale: 1.03 },
    ],
    easing: 'ease-in-out',
  },
};

// ── Transition Presets ─────────────────────────────────────────────────────────

export const TRANSITION_PRESETS: Record<string, TransitionPresetConfig> = {
  hard_cut: {
    id: 'hard_cut',
    label: 'Hard Cut',
    durationFrames: 1,
    type: 'opacity',
    easing: 'linear',
  },
  cross_dissolve: {
    id: 'cross_dissolve',
    label: 'Cross Dissolve',
    durationFrames: 12,
    type: 'opacity',
    easing: 'ease-in-out',
  },
  soft_fade: {
    id: 'soft_fade',
    label: 'Soft Fade',
    durationFrames: 18,
    type: 'opacity',
    easing: 'ease-in-out',
  },
  match_cut: {
    id: 'match_cut',
    label: 'Match Cut',
    durationFrames: 6,
    type: 'scale',
    easing: 'spring',
  },
  slide_left: {
    id: 'slide_left',
    label: 'Slide Left',
    durationFrames: 14,
    type: 'slide',
    direction: 'left',
    easing: 'spring',
  },
  slide_right: {
    id: 'slide_right',
    label: 'Slide Right',
    durationFrames: 14,
    type: 'slide',
    direction: 'right',
    easing: 'spring',
  },
  zoom_through: {
    id: 'zoom_through',
    label: 'Zoom Through',
    durationFrames: 10,
    type: 'scale',
    easing: 'ease-in-out',
  },
  wipe_down: {
    id: 'wipe_down',
    label: 'Wipe Down',
    durationFrames: 12,
    type: 'wipe',
    direction: 'down',
    easing: 'ease-in-out',
  },
};

// ── Emphasis Visual Pop ───────────────────────────────────────────────────────
// The "Rule of Emphasis": when a keyword is spoken, trigger a visual pop.

export type EmphasisEffect = {
  type: 'glow' | 'scale_bump' | 'color_flash' | 'shake';
  intensity: number; // 0–1
  durationFrames: number;
};

export const EMPHASIS_EFFECTS: Record<string, EmphasisEffect> = {
  glow: { type: 'glow', intensity: 0.6, durationFrames: 12 },
  scale_bump: { type: 'scale_bump', intensity: 0.08, durationFrames: 10 },
  color_flash: { type: 'color_flash', intensity: 0.4, durationFrames: 8 },
  shake: { type: 'shake', intensity: 0.3, durationFrames: 6 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Resolve motion progress (0–1) within a scene for a given frame.
 */
export function getSceneProgress(frame: number, fps: number, startTime: number, endTime: number): number {
  const currentTime = frame / fps;
  const duration = Math.max(0.1, endTime - startTime);
  return Math.min(1, Math.max(0, (currentTime - startTime) / duration));
}

/**
 * Interpolate between motion keyframes for the current progress.
 */
export function interpolateMotion(preset: MotionPresetConfig, progress: number): {
  translateX: number;
  translateY: number;
  scale: number;
  rotate: number;
  opacity: number;
} {
  const kf = preset.keyframes;
  if (kf.length === 0) return { translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 };
  if (kf.length === 1) return { translateX: kf[0].translateX ?? 0, translateY: kf[0].translateY ?? 0, scale: kf[0].scale ?? 1, rotate: kf[0].rotate ?? 0, opacity: kf[0].opacity ?? 1 };

  // Find the two keyframes surrounding the current progress
  let lower = kf[0];
  let upper = kf[kf.length - 1];
  for (let i = 0; i < kf.length - 1; i++) {
    if (progress >= kf[i].progress && progress <= kf[i + 1].progress) {
      lower = kf[i];
      upper = kf[i + 1];
      break;
    }
  }

  const range = Math.max(0.001, upper.progress - lower.progress);
  const t = Math.min(1, Math.max(0, (progress - lower.progress) / range));
  const ease = easeInOut(t);

  return {
    translateX: lerp(lower.translateX ?? 0, upper.translateX ?? 0, ease),
    translateY: lerp(lower.translateY ?? 0, upper.translateY ?? 0, ease),
    scale: lerp(lower.scale ?? 1, upper.scale ?? 1, ease),
    rotate: lerp(lower.rotate ?? 0, upper.rotate ?? 0, ease),
    opacity: lerp(lower.opacity ?? 1, upper.opacity ?? 1, ease),
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
