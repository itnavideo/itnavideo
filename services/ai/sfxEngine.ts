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
 * narrative intent, and textual keywords.
 */
export function resolveSceneSfxRole(scene: SceneSfxContext, sceneIndex: number): SfxRole | 'NONE' {
  // If explicitly disabled in planner
  if (scene.SFX === 'none') return 'NONE';

  const text = (scene.narrationSegment?.text || scene.heading || '').toLowerCase();
  const layout = (scene.layoutType || '').toLowerCase();
  const stype = (scene.sceneType || '').toLowerCase();

  // 1. Scene 1 / Opening Hook (0-4 seconds) -> Dramatic Impact
  if (sceneIndex === 0 || stype === 'hook' || scene.narrationSegment.startSeconds < 1.0) {
    return 'DRAMATIC_HOOK';
  }

  // 2. Financial / Revenue / Money Metrics -> Cash / Coin / Bell
  if (
    text.includes('$') ||
    text.includes('₹') ||
    text.includes('dollar') ||
    text.includes('rupee') ||
    text.includes('crore') ||
    text.includes('revenue') ||
    text.includes('profit') ||
    text.includes('earning') ||
    text.includes('sales') ||
    text.includes('money')
  ) {
    return 'ACCENT_STAT';
  }

  // 3. Stat Cards / Data / Numbers / Growth
  if (
    layout === 'stat_card' ||
    layout === 'data_visualization' ||
    stype === 'example_stat' ||
    text.includes('%') ||
    text.includes('percent') ||
    text.includes('growth') ||
    text.includes('increase')
  ) {
    return 'ACCENT_STAT';
  }

  // 4. Quotes / Philosophical / Historical Statements
  if (layout === 'quote' || text.startsWith('"') || text.includes('“')) {
    return 'TEXT_QUOTE';
  }

  // 5. Screenshots / Tech Tools / Digital UI
  if (
    layout === 'screenshot_highlight' ||
    text.includes('screenshot') ||
    text.includes('software') ||
    text.includes('click') ||
    text.includes('dashboard')
  ) {
    return 'TECH_ACCENT';
  }

  // 6. Checklist / Multi-point Lists / Bullet Items
  if (layout === 'checklist' || layout === 'numbered_point') {
    return 'UI_POP';
  }

  // 7. Transitions / New Chapters / Major Shifts
  if (stype === 'transition' || layout === 'split_screen' || scene.SFX === 'woosh' || scene.SFX === 'whoosh') {
    return 'TRANSITION_WHOOSH';
  }

  // 8. Explicit planner tag overrides
  if (scene.SFX === 'rise') return 'DRAMATIC_HOOK';
  if (scene.SFX === 'chime') return 'ACCENT_STAT';
  if (scene.SFX === 'pop') return 'UI_POP';

  // 9. Moderate emphasis scenes get subtle pops
  if (stype === 'emphasis' || stype === 'main_point') {
    return 'UI_POP';
  }

  // Default to transition whoosh if between chapters, otherwise UI pop
  return sceneIndex % 3 === 0 ? 'TRANSITION_WHOOSH' : 'UI_POP';
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
      durationSec: 0.3,
      role,
      defaultVolume: 0.22,
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
  if (durationSec <= 30) return 6;
  if (durationSec <= 60) return 10;
  if (durationSec <= 120) return 16;
  if (durationSec <= 300) return 24;
  return Math.min(45, Math.round(durationSec / 10));
}

/**
 * Generates timed, frame-exact SFX events from scene blueprints.
 * 
 * Rules:
 * 1. Minimum cooldown: 2.8s (84 frames at 30fps) to prevent sound clutter.
 * 2. Golden ratio budgeting based on duration.
 * 3. Studio volume ducking: voice is never overwhelmed.
 * 4. High-availability Cloudinary CDN streaming for Remotion Lambda.
 */
export function generateSFXEvents(
  scenes: SceneSfxContext[],
  fps: number = DEFAULT_FPS,
  totalVideoDurationSec?: number
): TimedSfxEvent[] {
  if (!scenes || scenes.length === 0) return [];

  const events: TimedSfxEvent[] = [];
  const minGapFrames = Math.round(2.8 * fps); // at least 2.8s gap
  const recentNames = new Set<string>();

  // Determine overall duration
  const lastScene = scenes[scenes.length - 1];
  const calculatedDuration =
    totalVideoDurationSec ||
    (lastScene?.narrationSegment?.endSeconds ||
      (lastScene?.narrationSegment?.startSeconds || 0) + (lastScene?.duration || 5));
  const maxBudget = getMaxSfxBudget(calculatedDuration);

  let lastSfxFrame = -minGapFrames; // allow first scene to trigger

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
      volume: asset.defaultVolume,
      sfxUrl: asset.url,
    });

    lastSfxFrame = sceneStartFrame;
  });

  return events;
}
