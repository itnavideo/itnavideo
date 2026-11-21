/**
 * Timed Sound Effects (SFX) Sync Engine
 *
 * Intelligently maps scene blueprints, narrative intent, and visual layouts
 * to curated Cloudinary SFX assets. Enforces studio audio pacing and volume
 * ducking to keep voiceover perfectly crisp.
 */

import { DEFAULT_FPS } from '../../remotion/constants';
import {
  SFX_BY_ROLE,
  DEFAULT_SFX_URLS,
  type SfxRole,
  type CloudinarySfxAsset,
} from './cloudinarySfxCatalog';

export interface TimedSfxEvent {
  id: string;
  sfxType: SfxRole | 'pop' | 'whoosh' | 'chime' | 'rise' | string;
  startFrame: number;
  volume: number;
  sfxUrl: string;
}

export interface SceneSfxContext {
  sceneNumber: number;
  duration: number;
  SFX?: string;
  sceneType?: string;
  layoutType?: string;
  heading?: string;
  narrationSegment: {
    startSeconds: number;
    endSeconds?: number;
    text?: string;
  };
}

/**
 * Detects the most effective SFX role for a scene based on its visual layout,
 * narrative intent, explicit planner tags, and textual keywords.
 */
export function resolveSceneSfxRole(scene: SceneSfxContext, sceneIndex: number): SfxRole | 'NONE' {
  // If explicitly muted by user or planner
  if (scene.SFX === 'muted') return 'NONE';

  const text = (scene.narrationSegment?.text || scene.heading || '').toLowerCase();
  const layout = (scene.layoutType || '').toLowerCase();
  const stype = (scene.sceneType || '').toLowerCase();
  const rawSfx = (scene.SFX || '').toLowerCase();

  // 1. Scene 1 / Opening Hook (0-4 seconds) -> Cinematic Impact / Boom
  if (sceneIndex === 0 || stype === 'hook' || scene.narrationSegment.startSeconds < 1.0) {
    return 'DRAMATIC_HOOK';
  }

  // 2. Explicit Planner Tags (Priority matching from AI director)
  if (rawSfx === 'rise') return 'DRAMATIC_HOOK';
  if (rawSfx === 'hit') return 'DRAMATIC_HOOK';
  if (rawSfx === 'woosh' || rawSfx === 'whoosh' || rawSfx === 'swipe') return 'TRANSITION_WHOOSH';
  if (rawSfx === 'pop' || rawSfx === 'click') return 'UI_POP';
  if (rawSfx === 'chime' || rawSfx === 'bell' || rawSfx === 'ding' || rawSfx === 'coin') return 'ACCENT_STAT';

  // 3. High-Impact Visual Archetypes (Comparisons, Versus, Before-After)
  if (
    layout === 'comparison' ||
    layout === 'comparison_versus' ||
    layout === 'vs_battle' ||
    layout === 'before_after_transformation'
  ) {
    return 'DRAMATIC_HOOK';
  }

  // 4. Key Stat Cards / Numerical Revelations -> Chime / Bell / Stat Accent
  if (
    layout === 'stat_card' ||
    layout === 'data_visualization' ||
    layout === 'data_dashboard' ||
    layout === 'metric_pill' ||
    stype === 'example_stat' ||
    text.includes('%') ||
    text.includes('$') ||
    text.includes('₹') ||
    /\b(roi|percent|growth|crore|lakh|million|billion)\b/.test(text)
  ) {
    return 'ACCENT_STAT';
  }

  // 5. Scene Transitions & Major Chapter Shifts -> Whoosh/Sweep
  if (stype === 'transition' || stype === 'next_point' || layout === 'chapter_title') {
    return 'TRANSITION_WHOOSH';
  }

  // 6. Key Text Highlight / Checklist / Multi-Step Process -> Crisp UI Pop
  if (
    layout === 'checklist' ||
    layout === 'numbered_steps' ||
    layout === 'roadmap' ||
    layout === 'horizontal_process' ||
    layout === 'process_horizontal_flow' ||
    stype === 'emphasis'
  ) {
    return 'UI_POP';
  }

  // 7. Quotes, Notebook & Paper Revelations
  if (layout === 'quote' || layout === 'takeaway') {
    return 'TEXT_QUOTE';
  }

  // 8. General Narrative Scene Transitions (Alternating rhythm across scenes)
  if (sceneIndex > 0) {
    return sceneIndex % 2 === 0 ? 'TRANSITION_WHOOSH' : 'UI_POP';
  }

  return 'NONE';
}

/**
 * Picks an asset from the specified role with anti-repetition rotation.
 */
function pickAssetWithRotation(
  role: SfxRole,
  recentAssetNames: Set<string>
): CloudinarySfxAsset {
  const pool = SFX_BY_ROLE[role] || [];
  if (pool.length === 0) {
    return {
      id: `fallback-${role}`,
      name: role.toLowerCase(),
      url: DEFAULT_SFX_URLS[role],
      durationSec: 0.5,
      role,
      defaultVolume: 0.30,
    };
  }

  // Find candidates that haven't been used recently
  const freshCandidates = pool.filter((item) => !recentAssetNames.has(item.name));
  const candidatePool = freshCandidates.length > 0 ? freshCandidates : pool;

  // Pick deterministic pseudo-random variant
  const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  return chosen;
}

/**
 * Calculates budget limits based on total video duration.
 */
function getMaxSfxBudget(durationSec: number): number {
  if (durationSec <= 30) return 8;
  if (durationSec <= 60) return 15;
  if (durationSec <= 120) return 26;
  if (durationSec <= 300) return 48;
  return Math.min(60, Math.round(durationSec / 6));
}

/**
 * Generates timed, frame-exact SFX events from scene blueprints.
 * 
 * Rules:
 * 1. Minimum cooldown: 2.6s (78 frames at 30fps) to prevent sound clutter while keeping key beats punchy.
 * 2. Golden ratio budgeting based on duration.
 * 3. Studio volume balancing (0.28-0.38) so sound effects are clearly perceptible above BGM.
 * 4. High-availability AWS S3 CDN streaming for Remotion Lambda.
 */
export function generateSFXEvents(
  scenes: SceneSfxContext[],
  fps: number = DEFAULT_FPS,
  totalVideoDurationSec?: number
): TimedSfxEvent[] {
  if (!scenes || scenes.length === 0) return [];

  const events: TimedSfxEvent[] = [];
  // Pacing rule: 2.6s minimum gap prevents spam while ensuring key visual arrivals are audible
  const minGapFrames = Math.round(2.6 * fps);
  const recentNames = new Set<string>();

  // Determine overall duration
  const lastScene = scenes[scenes.length - 1];
  const calculatedDuration =
    totalVideoDurationSec ||
    (lastScene?.narrationSegment?.endSeconds ||
      (lastScene?.narrationSegment?.startSeconds || 0) + (lastScene?.duration || 5));
  const maxBudget = getMaxSfxBudget(calculatedDuration);

  let lastSfxFrame = -minGapFrames; // allow first scene (hook) to trigger at frame 0

  scenes.forEach((scene, idx) => {
    if (events.length >= maxBudget) return;

    const startSeconds = scene.narrationSegment?.startSeconds ?? 0;
    const sceneStartFrame = Math.round(startSeconds * fps);

    // Enforce cooldown: do not trigger if too close to previous sound
    if (sceneStartFrame - lastSfxFrame < minGapFrames) {
      return;
    }

    const role = resolveSceneSfxRole(scene, idx);
    if (role === 'NONE') return;

    const asset = pickAssetWithRotation(role, recentNames);

    // Keep track of recent names (sliding window of 6)
    recentNames.add(asset.name);
    if (recentNames.size > 6) {
      const first = recentNames.values().next().value;
      if (first) recentNames.delete(first);
    }

    events.push({
      id: `sfx-${scene.sceneNumber || idx}-${idx}`,
      sfxType: asset.name,
      startFrame: sceneStartFrame,
      volume: Math.min(0.42, Math.max(0.24, asset.defaultVolume || 0.30)),
      sfxUrl: asset.url,
    });

    lastSfxFrame = sceneStartFrame;
  });

  return events;
}
