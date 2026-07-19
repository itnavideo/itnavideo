/**
 * Gemini Pose Context Builder
 *
 * Transforms PoseAnalysisResult into a compact prompt context string
 * that Gemini can consume alongside the transcript to make better
 * animation/placement decisions.
 *
 * Keeps the context concise (<2000 tokens) to avoid unnecessary cost.
 */

import type { PoseAnalysisResult, PoseFrame } from './types';

/**
 * Build a compact context string for Gemini from pose analysis results.
 * Returns empty string if analysis is unreliable (Gemini will use transcript-only logic).
 */
export function buildGeminiPoseContext(analysis: PoseAnalysisResult): string {
  if (!analysis.ok || analysis.source === 'fallback-empty' || !analysis.summary.reliable) {
    return '';
  }

  const { summary, frames } = analysis;
  const lines: string[] = [];

  lines.push('## Visual Pose Analysis (from video frames)');
  lines.push(`Duration: ${analysis.videoDurationSeconds.toFixed(1)}s | Sampled: ${analysis.frameCount} frames`);
  lines.push(`Dominant posture: ${summary.dominantPosture} | Facing: ${summary.dominantOrientation}`);
  lines.push(`Confidence: ${(summary.averageConfidence * 100).toFixed(0)}%`);
  lines.push('');

  // Key gesture timeline (compact)
  if (summary.gestureEvents.length > 0) {
    lines.push('### Gesture Timeline:');
    for (const event of summary.gestureEvents.slice(0, 20)) {
      lines.push(`- ${event.timestampSeconds.toFixed(1)}s: ${event.gesture}`);
    }
    lines.push('');
  }

  // Posture changes (only report transitions, not every frame)
  const transitions = getPostureTransitions(frames);
  if (transitions.length > 0) {
    lines.push('### Posture Changes:');
    for (const t of transitions.slice(0, 15)) {
      lines.push(`- ${t.timestampSeconds.toFixed(1)}s: ${t.from} → ${t.to}`);
    }
    lines.push('');
  }

  // Orientation shifts
  const orientationShifts = getOrientationShifts(frames);
  if (orientationShifts.length > 0) {
    lines.push('### Orientation Shifts:');
    for (const s of orientationShifts.slice(0, 15)) {
      lines.push(`- ${s.timestampSeconds.toFixed(1)}s: facing ${s.to}`);
    }
  }

  return lines.join('\n');
}

/**
 * Detect posture transitions (standing → sitting, etc.)
 */
function getPostureTransitions(frames: PoseFrame[]): Array<{ timestampSeconds: number; from: string; to: string }> {
  const transitions: Array<{ timestampSeconds: number; from: string; to: string }> = [];
  let prev = frames[0]?.posture;

  for (let i = 1; i < frames.length; i++) {
    if (frames[i].posture !== prev && frames[i].posture !== 'unknown' && frames[i].confidence > 0.5) {
      transitions.push({
        timestampSeconds: frames[i].timestampSeconds,
        from: prev || 'unknown',
        to: frames[i].posture,
      });
      prev = frames[i].posture;
    }
  }

  return transitions;
}

/**
 * Detect orientation shifts (center → left, etc.)
 */
function getOrientationShifts(frames: PoseFrame[]): Array<{ timestampSeconds: number; to: string }> {
  const shifts: Array<{ timestampSeconds: number; to: string }> = [];
  let prev = frames[0]?.orientation;

  for (let i = 1; i < frames.length; i++) {
    if (frames[i].orientation !== prev && frames[i].confidence > 0.5) {
      shifts.push({ timestampSeconds: frames[i].timestampSeconds, to: frames[i].orientation });
      prev = frames[i].orientation;
    }
  }

  return shifts;
}
