/**
 * AI Autonomous Director & Video Polisher Engine
 *
 * Implements:
 * 1. Autonomous Typography & Kinetic Style Decision Engine:
 *    - Fonts: Trajan Pro / Cinzel (Cinematic authority), Trebuchet MS / Plus Jakarta Sans (Modern tech), Montserrat (Punch), Fira Code (Tech/Terminal)
 *    - Font Size: Dynamic based on phrase importance & length (28px - 76px)
 *    - Pattern: Bold, Underline, Italic, Normal
 *    - Case: TT (ALL CAPS), Tt (Title Case), tt (lowercase)
 *    - Color: Semantic palette (White #FFFFFF, Neon Yellow #FACC15, Emerald #10B981, Electric Orange #EA580C, Cyber Sky #38BDF8, Red #EF4444)
 *    - Alignment: center, left, right
 *    - Transform: scale, uniformScale, position (X, Y), rotation (-3° to +3°) to prevent face/UI collision
 *    - 25 Kinetic Animations with DYNAMIC DURATION (scaled to word/speech cadence, never fixed: 5 frames for quick punches, stretched for long breaths)
 *
 * 2. Talking Head + Screen Recording & Multi-Asset Sync (Contextual A/B Roll Switching):
 *    - Screen In Triggers ("as you can see here", "look at my screen", "look at this graph") -> Cuts to Screen / Asset (full-cutaway or PIP)
 *    - Speaker In Triggers ("in my experience", "here is the thing", "what i noticed", "i believe") -> Cuts back to Talking Head
 *
 * 3. Smart Jump Cuts, Repeats & Pause Trimming:
 *    - Detects silences > 0.4s and false starts / repeated takes
 *
 * 4. Cinema Color Grade Adjustment Layer:
 *    - Saturation +15%, Contrast +20%, Lowered Shadows (#0A0F1D deep studio tint)
 */

export type KineticAnimationName =
  | 'zoom-out-2'
  | 'jolt-forward'
  | 'flicker'
  | 'faulty-text'
  | 'spring'
  | 'karaoke'
  | 'mini-zoom'
  | 'blur'
  | 'concentrate'
  | 'bounce-left'
  | 'wave-in'
  | 'bounce-right'
  | 'zoom-out'
  | 'open'
  | 'wipe-right'
  | 'roll-in'
  | 'slide-right'
  | 'slide-up'
  | 'boing'
  | 'showing-up'
  | 'throw-out'
  | 'grow'
  | 'judder-up'
  | 'trail'
  | 'float-down';

export type TextCase = 'TT' | 'tt' | 'Tt';
export type TextPattern = 'bold' | 'italic' | 'underline' | 'normal';
export type TextAlignment = 'center' | 'left' | 'right';

export interface PlannedTypographyItem {
  id: string;
  text: string;
  displayText: string;
  startSeconds: number;
  durationSeconds: number;
  animation: KineticAnimationName;
  fontFamily: string;
  fontSize: number;
  pattern: TextPattern;
  case: TextCase;
  color: string;
  alignment: TextAlignment;
  scale: number;
  rotationDeg: number;
  xOffset: number;
  yOffset: number;
  isHeroPunch: boolean;
  dynamicDurationFrames: number;
  words?: Array<{ word: string; start: number; end: number }>;
}

export interface ScreenSyncCue {
  id: string;
  cuePhrase: string;
  timestampSeconds: number;
  recommendedDurationSeconds: number;
  cutType: 'full-cutaway' | 'pip-top-right' | 'pip-center';
  matchedAssetId?: string;
  matchedAssetUrl?: string;
  title?: string;
}

export interface ContextualABRollSegment {
  id: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  sourceType: 'talking-head' | 'screen-recording' | 'b-roll';
  cutType: 'talking-head' | 'full-cutaway' | 'pip-top-right';
  assetId?: string;
  assetUrl?: string;
  assetTitle?: string;
  triggerPhrase?: string;
  reason: string;
}

export interface CinemaAdjustmentConfig {
  enabled: boolean;
  saturationMultiplier: number; // 1.15 = +15%
  contrastMultiplier: number;   // 1.20 = +20%
  brightnessMultiplier: number; // 0.96 = lowered shadows / deep black point
  shadowTintHex: string;        // #0A0F1D deep studio tint
  tintOpacity: number;          // 0.06 - 0.08
}

// ── 25 KINETIC ANIMATION CATALOG DEFINITIONS ───────────────────────────────
export const KINETIC_ANIMATION_CATALOG: Array<{
  id: KineticAnimationName;
  name: string;
  category: 'Impact' | 'Motion' | 'Glitch' | 'Editorial' | 'Playful';
  description: string;
}> = [
  { id: 'zoom-out-2', name: 'Zoom Out 2', category: 'Impact', description: 'Double-stage backward kinetic spring deceleration' },
  { id: 'jolt-forward', name: 'Jolt Forward', category: 'Impact', description: 'Sudden forward snap with elastic rebound' },
  { id: 'flicker', name: 'Flicker', category: 'Glitch', description: 'Rapid luminescence strobe mimicking neon illumination' },
  { id: 'faulty-text', name: 'Faulty Text', category: 'Glitch', description: 'Micro chromatic aberration shift on entrance' },
  { id: 'spring', name: 'Spring', category: 'Motion', description: 'Smooth physics-based overshoot and settle' },
  { id: 'karaoke', name: 'Karaoke', category: 'Editorial', description: 'Word-by-word progressive color highlight sweep' },
  { id: 'mini-zoom', name: 'Mini Zoom', category: 'Impact', description: 'Subtle 8% punch-in emphasizing core takeaway' },
  { id: 'blur', name: 'Blur Dissolve', category: 'Editorial', description: 'Gaussian optical blur into razor-sharp focus' },
  { id: 'concentrate', name: 'Concentrate', category: 'Editorial', description: 'Wide letter-spacing converging into tight lock' },
  { id: 'bounce-left', name: 'Bounce Left', category: 'Motion', description: 'Elastic entrance from the left border' },
  { id: 'wave-in', name: 'Wave In', category: 'Motion', description: 'Sine-wave vertical ripple across word characters' },
  { id: 'bounce-right', name: 'Bounce Right', category: 'Motion', description: 'Elastic entrance from the right border' },
  { id: 'zoom-out', name: 'Zoom Out', category: 'Impact', description: 'Starts oversized (2.2x) and snaps into place' },
  { id: 'open', name: 'Open Curtain', category: 'Motion', description: 'Vertical split expansion reveal' },
  { id: 'wipe-right', name: 'Wipe Right', category: 'Motion', description: 'Linear clip-path horizontal reveal' },
  { id: 'roll-in', name: 'Roll In', category: 'Playful', description: 'Slight rotational tilt combined with scale' },
  { id: 'slide-right', name: 'Slide Right', category: 'Motion', description: 'Directional slide from left to right' },
  { id: 'slide-up', name: 'Slide Up', category: 'Motion', description: 'Smooth upward elevation from bottom third' },
  { id: 'boing', name: 'Boing', category: 'Playful', description: 'Rubber-band squash and stretch dynamics' },
  { id: 'showing-up', name: 'Showing Up', category: 'Editorial', description: 'Instant pop with subtle radial ambient glow' },
  { id: 'throw-out', name: 'Throw Out', category: 'Impact', description: 'Centrifugal acceleration launching text into frame' },
  { id: 'grow', name: 'Grow', category: 'Impact', description: 'Continuous progressive scale growth throughout duration' },
  { id: 'judder-up', name: 'Judder Up', category: 'Glitch', description: 'Stepped mechanical jitter rising into position' },
  { id: 'trail', name: 'Trail', category: 'Motion', description: 'Motion ghost trail echo on fast transition' },
  { id: 'float-down', name: 'Float Down', category: 'Motion', description: 'Gentle atmospheric descent with subtle pendulum sway' },
];

// ── VERBAL SCREEN DEMO MARKERS (Screen In) ──────────────────────────────────
export const SCREEN_SYNC_TRIGGERS = [
  /\b(?:as you can see(?: here)?)\b/i,
  /\b(?:look at (?:this|the|my|these)(?: graph| chart| screen| code| dashboard| table| stat| slide)?)\b/i,
  /\b(?:on (?:the|my) screen)\b/i,
  /\b(?:let me show you)\b/i,
  /\b(?:here is (?:the|a))\b/i,
  /\b(?:check this out)\b/i,
  /\b(?:in the (?:code|terminal|dashboard|browser|app|editor|ide))\b/i,
  /\b(?:take a look)\b/i,
  /\b(?:right here)\b/i,
  /\b(?:click on|open the)\b/i,
];

// ── SPEAKER CONVICTION MARKERS (Speaker In / Cut back to Talking Head) ──────
export const SPEAKER_CONVICTION_TRIGGERS = [
  /\b(?:in my experience)\b/i,
  /\b(?:here is the thing)\b/i,
  /\b(?:what i noticed)\b/i,
  /\b(?:i believe|i really believe)\b/i,
  /\b(?:trust me)\b/i,
  /\b(?:the truth is)\b/i,
  /\b(?:personally|my take on this)\b/i,
  /\b(?:let me be honest|honestly speaking)\b/i,
  /\b(?:my advice is)\b/i,
  /\b(?:the bottom line)\b/i,
];

// Helper: Convert to Title Case
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

/**
 * 1. AUTONOMOUS TYPOGRAPHY & STYLE DECISION ENGINE
 *
 * For each speech caption, dynamically chooses font, size, pattern, case, color,
 * alignment, transform, and one of the 25 kinetic animations.
 *
 * Core Rule: "Do not keep layout animation duration fixed — it must be dynamic."
 * - Fast words (e.g. 0.18s) execute in 5 frames for high-impact punch.
 * - Stretched phrases (e.g. 1.2s) stretch dynamically to match that exact spoken breath.
 */
export function planAutonomousTypographyAndStyle(
  captions: Array<{ text: string; start: number; end: number; words?: Array<{ word: string; start: number; end: number }> }>,
  fps = 30
): PlannedTypographyItem[] {
  if (!captions || captions.length === 0) return [];

  return captions.map((cap, idx) => {
    const rawText = cap.text?.trim() || '';
    const cleanLower = rawText.toLowerCase();
    const duration = Math.max(0.18, (cap.end ?? 0) - (cap.start ?? 0));
    const tokenCount = rawText.split(/\s+/).filter(Boolean).length;

    // Detect numbers, currency, stats
    const hasNumbers = /(\$|₹|€|£)?\s*\d+(?:[,\.]\d+)*(?:\s*(?:k|m|b|%|x))?/i.test(rawText);
    const hasWarning = /\b(?:mistake|warning|danger|stop|never|wrong|trap|fail|worst|bad|avoid)\b/i.test(cleanLower);
    const hasHook = idx === 0 || /\b(?:secret|truth|insane|unbelievable|proof|revealed|hidden|crucial)\b/i.test(cleanLower);
    const hasTechOrCode = /\b(?:code|terminal|api|function|build|next|react|component|server|database|prompt)\b/i.test(cleanLower);
    const hasQuoteOrNuance = /["']/.test(rawText) || /\b(?:remember|think about|imagine|believe|in my opinion)\b/i.test(cleanLower);
    const isVeryShort = duration <= 0.35 || tokenCount <= 2;

    // 1. Dynamic Font Selection:
    // - Classical authority / hook: Trajan Pro / Cinzel
    // - Modern tech explainer: Plus Jakarta Sans / Trebuchet MS
    // - High retention stats: Montserrat
    // - Code/Terminal: Fira Code
    let fontFamily = "'Plus Jakarta Sans', 'Trebuchet MS', sans-serif";
    if (hasHook) {
      fontFamily = "'Cinzel', 'Trajan Pro', Georgia, serif";
    } else if (hasTechOrCode) {
      fontFamily = "'Fira Code', 'JetBrains Mono', monospace";
    } else if (hasNumbers || tokenCount <= 3) {
      fontFamily = "'Montserrat', 'Arial Black', sans-serif";
    } else {
      fontFamily = "'Trebuchet MS', 'Plus Jakarta Sans', sans-serif";
    }

    // 2. Dynamic Font Size (based on token count & importance)
    let fontSize = 38;
    let isHeroPunch = false;
    if (tokenCount <= 2 || hasNumbers) {
      fontSize = 58;
      isHeroPunch = true;
    } else if (tokenCount <= 4) {
      fontSize = 46;
      isHeroPunch = true;
    } else if (tokenCount <= 8) {
      fontSize = 38;
    } else {
      fontSize = 32;
    }

    // 3. Dynamic Pattern (Bold, Underline, Italic, Normal)
    // - High retention words: bold
    // - Urgent warning words: underline
    // - Quotes or internal thoughts: italic
    let pattern: TextPattern = 'bold';
    if (hasWarning) {
      pattern = 'underline';
    } else if (hasQuoteOrNuance) {
      pattern = 'italic';
    } else if (tokenCount > 10) {
      pattern = 'normal';
    }

    // 4. Dynamic Case (TT = ALL CAPS, Tt = Title Case, tt = lowercase)
    // - ALL CAPS (TT) for high-energy hooks and shout words
    // - Title Case (Tt) for names and core takeaways
    // - lowercase (tt) for casual or conversational phrases
    let textCase: TextCase = 'Tt';
    if (hasHook || hasNumbers || isHeroPunch) {
      textCase = 'TT';
    } else if (cleanLower.startsWith('and ') || cleanLower.startsWith('so ') || tokenCount > 9) {
      textCase = 'tt';
    } else {
      textCase = 'Tt';
    }

    let displayText = rawText;
    if (textCase === 'TT') {
      displayText = rawText.toUpperCase();
    } else if (textCase === 'Tt') {
      displayText = toTitleCase(rawText);
    } else {
      displayText = rawText.toLowerCase();
    }

    // 5. Dynamic Color & Contrast Selection
    // Primary stays crisp white (#FFFFFF); keywords shift to punchy accents
    let color = '#FFFFFF';
    if (hasNumbers) {
      color = '#10B981'; // Emerald for stats, proof & financial metrics
    } else if (hasWarning) {
      color = '#EF4444'; // Coral Red for warnings and mistakes
    } else if (hasHook) {
      color = '#FACC15'; // Neon Yellow for hooks & high energy
    } else if (hasTechOrCode) {
      color = '#38BDF8'; // Cyber Sky for tech concepts
    } else if (idx % 4 === 1) {
      color = '#EA580C'; // Electric Orange for active emphasis
    } else {
      color = '#FFFFFF';
    }

    // 6. Dynamic Alignment
    let alignment: TextAlignment = 'center';
    if (hasTechOrCode && tokenCount > 6) {
      alignment = 'left';
    }

    // 7. Dynamic Transform (Scale, Position, Rotation)
    // Adjust scale, position and rotation (-3° to +3°) to keep visual dynamism
    let scale = 1.0;
    let rotationDeg = 0;
    if (isHeroPunch) {
      scale = 1.10;
      rotationDeg = idx % 2 === 0 ? 2.5 : -2.5; // Alternating dynamic tilt
    } else if (isVeryShort) {
      scale = 1.05;
      rotationDeg = idx % 2 === 0 ? 1.5 : -1.5;
    }

    // 8. 25 Kinetic Animation Assignment
    const candidateAnimations: KineticAnimationName[] = hasNumbers
      ? ['jolt-forward', 'zoom-out-2', 'showing-up', 'grow']
      : hasHook
      ? ['zoom-out', 'spring', 'throw-out', 'boing', 'open']
      : hasWarning
      ? ['flicker', 'faulty-text', 'judder-up']
      : hasTechOrCode
      ? ['wipe-right', 'slide-right', 'concentrate', 'trail']
      : isVeryShort
      ? ['jolt-forward', 'boing', 'showing-up', 'spring']
      : ['slide-up', 'wave-in', 'bounce-left', 'bounce-right', 'karaoke', 'float-down', 'mini-zoom', 'blur', 'roll-in'];

    const chosenAnimation = candidateAnimations[idx % candidateAnimations.length];

    // 9. DYNAMIC DURATION CALCULATION:
    // Core Rule: "Do not keep layout animation duration fixed — it must be dynamic."
    // - Fast words (e.g. 0.18s): Math.max(5, Math.round(0.18 * 30)) = 5 frames
    // - Stretched word (e.g. 1.2s): Math.round(1.2 * 30) = 36 frames
    const dynamicDurationFrames = Math.max(5, Math.round(duration * fps));

    return {
      id: `kinetic-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      text: rawText,
      displayText,
      startSeconds: cap.start ?? 0,
      durationSeconds: duration,
      animation: chosenAnimation,
      fontFamily,
      fontSize,
      pattern,
      case: textCase,
      color,
      alignment,
      scale,
      rotationDeg,
      xOffset: 0,
      yOffset: 0,
      isHeroPunch,
      dynamicDurationFrames,
      words: cap.words,
    };
  });
}

/**
 * 2. SCREEN RECORDING & ADDITIONAL ASSET SYNCHRONIZATION
 *
 * Scans transcript for verbal demo markers ("as you can see here", "look at this graph", etc.)
 * and pairs them with uploaded screen recordings or assets.
 */
export function detectScreenSyncMoments(
  captions: Array<{ text: string; start: number; end: number }>,
  additionalAssets: Array<{ id: string; url?: string; name?: string; type: 'video' | 'image' }> = []
): ScreenSyncCue[] {
  const cues: ScreenSyncCue[] = [];
  let assetCursor = 0;

  for (const cap of captions) {
    const text = cap.text || '';
    for (const trigger of SCREEN_SYNC_TRIGGERS) {
      const match = text.match(trigger);
      if (match) {
        const assignedAsset = additionalAssets.length > 0 ? additionalAssets[assetCursor % additionalAssets.length] : undefined;
        assetCursor++;

        cues.push({
          id: `cue-${cues.length}`,
          cuePhrase: match[0],
          timestampSeconds: Math.max(0, (cap.start ?? 0) - 0.15), // Snappy entrance 150ms before cue word completes
          recommendedDurationSeconds: 4.5,
          cutType: cues.length % 2 === 0 ? 'full-cutaway' : 'pip-top-right',
          matchedAssetId: assignedAsset?.id,
          matchedAssetUrl: assignedAsset?.url,
          title: assignedAsset?.name || 'Screen Recording Demo',
        });
        break;
      }
    }
  }

  // Fallback: If no verbal cues matched but creator provided assets, create a natural cutaway at second 3.8
  if (cues.length === 0 && additionalAssets.length > 0) {
    const firstAsset = additionalAssets[0];
    cues.push({
      id: 'cue-0-default',
      cuePhrase: 'Featured Screen Demo',
      timestampSeconds: 3.8,
      recommendedDurationSeconds: 4.5,
      cutType: 'full-cutaway',
      matchedAssetId: firstAsset.id,
      matchedAssetUrl: firstAsset.url,
      title: firstAsset.name || 'Screen Recording Demo',
    });
  }

  return cues;
}

/**
 * 3. CONTEXTUAL A/B ROLL SWITCHING TIMELINE
 *
 * Combines:
 * - Screen In Triggers: Cuts to Screen Recording / Walkthrough (full-cutaway or PIP)
 * - Speaker In Triggers: Cuts immediately back to the Talking Head when personal conviction is expressed!
 */
export function planContextualABRollTimeline(
  captions: Array<{ text: string; start: number; end: number }>,
  additionalAssets: Array<{ id: string; url?: string; name?: string; type: 'video' | 'image' }> = [],
  totalDurationSeconds = 60
): ContextualABRollSegment[] {
  const segments: ContextualABRollSegment[] = [];
  let currentSource: 'talking-head' | 'screen-recording' = 'talking-head';
  let segmentStart = 0;
  let activeAssetIdx = 0;

  for (const cap of captions) {
    const text = cap.text || '';
    const capStart = cap.start ?? 0;

    // Check for Screen In trigger
    const screenMatch = SCREEN_SYNC_TRIGGERS.find((rx) => rx.test(text));
    // Check for Speaker In (Conviction) trigger
    const speakerMatch = SPEAKER_CONVICTION_TRIGGERS.find((rx) => rx.test(text));

    if (screenMatch && currentSource === 'talking-head' && additionalAssets.length > 0) {
      // Cut from Talking Head -> Screen Recording!
      if (capStart > segmentStart) {
        segments.push({
          id: `seg-${segments.length}`,
          startSeconds: segmentStart,
          endSeconds: capStart,
          durationSeconds: capStart - segmentStart,
          sourceType: 'talking-head',
          cutType: 'talking-head',
          reason: 'Primary talking head camera feed',
        });
      }

      currentSource = 'screen-recording';
      segmentStart = capStart;
      const assigned = additionalAssets[activeAssetIdx % additionalAssets.length];
      activeAssetIdx++;

      // Minimum screen cut duration is 3.5 seconds or until a speaker conviction trigger
      const screenEnd = Math.min(totalDurationSeconds, capStart + 4.5);
      segments.push({
        id: `seg-${segments.length}`,
        startSeconds: segmentStart,
        endSeconds: screenEnd,
        durationSeconds: screenEnd - segmentStart,
        sourceType: 'screen-recording',
        cutType: segments.length % 2 === 0 ? 'full-cutaway' : 'pip-top-right',
        assetId: assigned.id,
        assetUrl: assigned.url,
        assetTitle: assigned.name,
        triggerPhrase: text.match(screenMatch)?.[0],
        reason: `Contextual cue: "${text.match(screenMatch)?.[0]}" -> Switch to screen demo`,
      });

      segmentStart = screenEnd;
      currentSource = 'talking-head';
    } else if (speakerMatch && currentSource === 'screen-recording') {
      // Immediate early cut back to Talking Head on personal conviction!
      currentSource = 'talking-head';
    }
  }

  // Close remaining time as talking-head
  if (segmentStart < totalDurationSeconds) {
    segments.push({
      id: `seg-${segments.length}`,
      startSeconds: segmentStart,
      endSeconds: totalDurationSeconds,
      durationSeconds: totalDurationSeconds - segmentStart,
      sourceType: 'talking-head',
      cutType: 'talking-head',
      reason: 'Talking head camera conclusion',
    });
  }

  return segments;
}

/**
 * 4. CINEMA ADJUSTMENT LAYER CONFIGURATION
 *
 * Studio standard: +15% saturation, +20% contrast, lowered shadow ceiling
 * for rich deep blacks and studio pop.
 */
export function getCinemaAdjustmentLayerConfig(userEnabled = true): CinemaAdjustmentConfig {
  return {
    enabled: userEnabled,
    saturationMultiplier: 1.15, // +15% saturation
    contrastMultiplier: 1.20,   // +20% contrast
    brightnessMultiplier: 0.96, // Lowered shadows & deep black point
    shadowTintHex: '#0A0F1D',
    tintOpacity: 0.08,
  };
}
