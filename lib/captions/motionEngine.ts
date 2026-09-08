// lib/captions/motionEngine.ts
// Parametric Remotion Spring Physics & Motion Engine for Motion Captions

import type { CaptionMotionConfig, MotionFamily } from './types';

export const MOTION_PROFILES: Record<MotionFamily, CaptionMotionConfig> = {
  'kinetic-slam': {
    family: 'kinetic-slam',
    mass: 0.4,
    damping: 12,
    stiffness: 280,
    scaleEntrance: [1.35, 1.0],
    translateYEntrancePx: [15, 0],
    blurEntrancePx: [6, 0],
    exitStyle: 'whip-up',
    exitDurationFrames: 5,
    wordStaggerFrames: 2,
  },
  'elastic-pop': {
    family: 'elastic-pop',
    mass: 0.5,
    damping: 10,
    stiffness: 320,
    scaleEntrance: [0.65, 1.0],
    translateYEntrancePx: [0, 0],
    blurEntrancePx: [4, 0],
    exitStyle: 'scale-down',
    exitDurationFrames: 4,
    wordStaggerFrames: 2,
  },
  'editorial-rise': {
    family: 'editorial-rise',
    mass: 0.7,
    damping: 18,
    stiffness: 160,
    scaleEntrance: [0.98, 1.0],
    translateYEntrancePx: [24, 0],
    blurEntrancePx: [8, 0],
    exitStyle: 'fade-out',
    exitDurationFrames: 6,
    wordStaggerFrames: 3,
  },
  'cyber-glitch': {
    family: 'cyber-glitch',
    mass: 0.35,
    damping: 14,
    stiffness: 360,
    scaleEntrance: [1.1, 1.0],
    translateYEntrancePx: [0, 0],
    blurEntrancePx: [3, 0],
    exitStyle: 'fade-out',
    exitDurationFrames: 4,
    glitchJitter: true,
    wordStaggerFrames: 1,
  },
  'paper-stamp': {
    family: 'paper-stamp',
    mass: 0.6,
    damping: 14,
    stiffness: 240,
    scaleEntrance: [1.22, 1.0],
    translateYEntrancePx: [-18, 0],
    blurEntrancePx: [2, 0],
    exitStyle: 'scale-down',
    exitDurationFrames: 5,
  },
  'smooth-fade': {
    family: 'smooth-fade',
    mass: 0.8,
    damping: 20,
    stiffness: 140,
    scaleEntrance: [0.96, 1.0],
    translateYEntrancePx: [10, 0],
    blurEntrancePx: [4, 0],
    exitStyle: 'fade-out',
    exitDurationFrames: 6,
  },
  'shimmer-drift': {
    family: 'shimmer-drift',
    mass: 0.9,
    damping: 22,
    stiffness: 130,
    scaleEntrance: [0.95, 1.0],
    translateYEntrancePx: [8, 0],
    blurEntrancePx: [5, 0],
    exitStyle: 'fade-out',
    exitDurationFrames: 7,
  },
};

/**
 * Retrieves or builds motion configuration for a caption phrase
 */
export function getMotionConfig(
  family: MotionFamily = 'kinetic-slam',
  overrides: Partial<CaptionMotionConfig> = {}
): CaptionMotionConfig {
  const base = MOTION_PROFILES[family] || MOTION_PROFILES['kinetic-slam'];
  return {
    ...base,
    ...overrides,
  };
}
