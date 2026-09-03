/**
 * Temporal Typography Event Tracker
 *
 * Tracks text elements across consecutive frames to form coherent Typography Events.
 * Calculates motion ramp trajectories (delta scale, delta position, opacity curves, easing)
 * by comparing consecutive transition burst frames.
 */

import type {
  TypographyEvent,
  KeyframeDetection,
  TransitionRamp,
  MotionEasing,
  EntranceMotionType,
  VisualStateSceneRole,
  EmphasisVisualTreatment,
  LayerPlacement,
} from '@/lib/typography/blueprintSchema';
import type { SampledFrame } from './frameSampling';

export interface FrameOCRData {
  timestamp: number;
  text: string;
  heroWord?: string;
  xRatio: number;
  yRatio: number;
  widthRatio: number;
  heightRatio: number;
  confidence: number;
  colors: string[];
}

/**
 * Calculates string similarity (Levenshtein-based Dice coefficient)
 */
function textSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  let intersection = 0;
  words1.forEach((w) => {
    if (words2.has(w)) intersection++;
  });

  return (2 * intersection) / (words1.size + words2.size);
}

/**
 * Infers motion curve & easing behavior from consecutive transition frames
 */
export function inferMotionCurveFromBurst(
  burstFrames: SampledFrame[],
  frameDetections: KeyframeDetection[]
): TransitionRamp {
  if (burstFrames.length < 2) {
    return {
      startSec: burstFrames[0]?.timestampSeconds || 0,
      endSec: (burstFrames[0]?.timestampSeconds || 0) + 0.3,
      durationSec: 0.3,
      deltaScale: 0.0,
      deltaOpacity: 1.0,
      deltaYRatio: 0.0,
      inferredEasing: 'ease-out-expo',
    };
  }

  const startSec = burstFrames[0].timestampSeconds;
  const endSec = burstFrames[burstFrames.length - 1].timestampSeconds;
  const durationSec = Math.max(0.12, endSec - startSec);

  // Find bounding box sizes in detections matching these frames
  const matchingDetections = frameDetections.filter((d) =>
    burstFrames.some((bf) => Math.abs(bf.timestampSeconds - d.timestampSeconds) < 0.06)
  );

  let deltaScale = 0.0;
  let deltaYRatio = 0.0;
  let deltaOpacity = 1.0;
  let inferredEasing: MotionEasing = 'ease-out-expo';

  if (matchingDetections.length >= 2) {
    const first = matchingDetections[0]?.boundingBox;
    const last = matchingDetections[matchingDetections.length - 1]?.boundingBox;

    if (first && last && first.heightRatio > 0 && last.heightRatio > 0) {
      const scaleRatio = last.heightRatio / first.heightRatio;
      deltaScale = Math.round((scaleRatio - 1.0) * 100) / 100;
      deltaYRatio = Math.round((first.yRatio - last.yRatio) * 1000) / 1000;

      // Detect spring overshoot (if middle frame was larger/higher than final frame)
      if (matchingDetections.length >= 3) {
        const mid = matchingDetections[1]?.boundingBox;
        if (mid && mid.heightRatio > last.heightRatio * 1.05) {
          inferredEasing = 'spring-bouncy';
        } else if (Math.abs(deltaScale) > 0.3) {
          inferredEasing = 'elastic-snap';
        } else {
          inferredEasing = 'ease-out-expo';
        }
      }
    }
  }

  return {
    startSec,
    endSec,
    durationSec,
    deltaScale,
    deltaOpacity,
    deltaYRatio,
    inferredEasing,
  };
}

/**
 * Tracks and clusters OCR detections across frames into continuous Typography Events
 */
export function trackTypographyEvents(
  detections: KeyframeDetection[],
  transitionBursts: Record<string, SampledFrame[]>,
  totalDurationSeconds: number
): TypographyEvent[] {
  const events: TypographyEvent[] = [];
  const sortedDetections = [...detections].sort((a, b) => a.timestampSeconds - b.timestampSeconds);

  if (sortedDetections.length === 0) {
    return events;
  }

  let currentCluster: KeyframeDetection[] = [sortedDetections[0]];

  for (let i = 1; i < sortedDetections.length; i++) {
    const prev = currentCluster[currentCluster.length - 1];
    const curr = sortedDetections[i];

    const similarity = textSimilarity(prev.detectedText, curr.detectedText);
    const timeDelta = curr.timestampSeconds - prev.timestampSeconds;

    // Same text element continuing over time
    if (similarity > 0.45 && timeDelta < 2.0) {
      currentCluster.push(curr);
    } else {
      // Finalize current cluster into a TypographyEvent
      events.push(buildTypographyEvent(currentCluster, transitionBursts, events.length));
      currentCluster = [curr];
    }
  }

  if (currentCluster.length > 0) {
    events.push(buildTypographyEvent(currentCluster, transitionBursts, events.length));
  }

  // Refine end times to ensure no gaps or overlaps
  for (let j = 0; j < events.length; j++) {
    const nextStart = j < events.length - 1 ? events[j + 1].startTime : totalDurationSeconds;
    events[j].endTime = Math.min(nextStart, Math.max(events[j].startTime + 0.8, events[j].endTime));
    events[j].duration = Math.round((events[j].endTime - events[j].startTime) * 100) / 100;
  }

  return events;
}

function buildTypographyEvent(
  cluster: KeyframeDetection[],
  transitionBursts: Record<string, SampledFrame[]>,
  eventIndex: number
): TypographyEvent {
  const first = cluster[0];
  const last = cluster[cluster.length - 1];

  const startTime = first.timestampSeconds;
  const endTime = Math.max(startTime + 0.8, last.timestampSeconds + 0.4);
  const text = cluster.find((c) => c.detectedText.length > 3)?.detectedText || first.detectedText || 'Typography';
  const heroKeyword = cluster.find((c) => c.primaryHeroWord)?.primaryHeroWord || extractHeroWord(text);

  // Determine hierarchy based on text structure
  const words = text.split(/\s+/).filter(Boolean);
  let hierarchy: 'hero' | 'lead' | 'sub' | 'badge' | 'metric' = 'hero';
  if (/\b\d+(\+|k|m|%|\$)?\b/i.test(text)) {
    hierarchy = 'metric';
  } else if (words.length >= 4) {
    hierarchy = 'sub';
  } else if (words.length === 1) {
    hierarchy = 'hero';
  } else {
    hierarchy = 'lead';
  }

  // Determine scene role
  const roles: VisualStateSceneRole[] = ['hook', 'statement', 'emphasis', 'keyword', 'conclusion'];
  const styleRole = eventIndex === 0 ? 'hook' : eventIndex >= 4 ? 'conclusion' : roles[eventIndex % roles.length];

  // Infer entrance motion type
  let entranceType: EntranceMotionType = 'slam-scale';
  const textLower = text.toLowerCase();
  if (textLower.includes('gold') || textLower.includes('slow') || textLower.includes('discipline')) {
    entranceType = 'rise-fade';
  } else if (textLower.includes('3d') || textLower.includes('depth') || textLower.includes('capsule')) {
    entranceType = 'pop-spring';
  } else if (textLower.includes('neon') || textLower.includes('cyber')) {
    entranceType = 'glow-pulse';
  } else if (textLower.includes('paper') || textLower.includes('clap') || textLower.includes('tape')) {
    entranceType = 'torn-paper-slap';
  } else if (textLower.includes('leverage') || textLower.includes('step')) {
    entranceType = 'step-reveal';
  }

  // Calculate motion ramp from transition burst if nearby
  const burstKey = Object.keys(transitionBursts).find((k) => {
    const bFrames = transitionBursts[k];
    return bFrames.some((bf) => Math.abs(bf.timestampSeconds - startTime) < 0.35);
  });

  const matchingBurst = burstKey ? transitionBursts[burstKey] : [];
  const ramp = inferMotionCurveFromBurst(matchingBurst, cluster);

  // Representative bounding box
  const bbox = cluster.find((c) => c.boundingBox)?.boundingBox || {
    xRatio: 0.5,
    yRatio: 0.68,
    widthRatio: 0.85,
    heightRatio: 0.22,
  };

  // Color gathering
  const allColors = Array.from(new Set(cluster.flatMap((c) => c.detectedColors || ['#FFFFFF'])));

  // Emphasis treatment
  let emphasisType: EmphasisVisualTreatment = 'contrast-color';
  if (textLower.includes('3d') || textLower.includes('pill')) {
    emphasisType = '3d-pill';
  } else if (textLower.includes('paper') || textLower.includes('tape')) {
    emphasisType = 'tape-badge';
  } else if (textLower.includes('neon') || textLower.includes('glow')) {
    emphasisType = 'glowing-box';
  } else {
    emphasisType = 'scale-pop';
  }

  const layerPlacement: LayerPlacement = textLower.includes('3d') || textLower.includes('behind') ? 'behind-subject' : 'in-front-subject';

  return {
    id: `event-${eventIndex}-${startTime.toFixed(2)}`,
    startTime,
    endTime,
    duration: Math.round((endTime - startTime) * 100) / 100,
    text,
    heroKeyword,
    hierarchy,
    styleRole,
    emphasisType,
    entrance: {
      type: entranceType,
      ramp,
    },
    activeMotion: 'subtle-breathe',
    exit: {
      type: 'quick-fade',
      durationSec: 0.2,
    },
    normalizedBoundingBox: bbox,
    detectedColors: allColors,
    layerPlacement,
  };
}

function extractHeroWord(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  // Pick all-caps or longest word
  const caps = words.find((w) => w.length > 2 && w === w.toUpperCase());
  if (caps) return caps;
  return words.reduce((longest, curr) => (curr.length > longest.length ? curr : longest), words[0]);
}
