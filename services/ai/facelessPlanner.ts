import {
  generateStructuredSceneBlueprint,
  buildDeterministicSceneBlueprint,
  TranscriptChunk,
  ScenePlannerOptions,
} from './aiScenePlanner';

export {
  generateStructuredSceneBlueprint,
  buildDeterministicSceneBlueprint,
};
export type { TranscriptChunk, ScenePlannerOptions };

export type StatCalloutBadge = {
  id: string;
  startFrame: number;
  endFrame: number;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  connectorLine: boolean;
};

import { DEFAULT_FPS } from '../../remotion/constants';

export function extractStatCalloutsFromTranscript(
  transcript: { text: string; start: number; end: number }[],
  fps: number = DEFAULT_FPS
): StatCalloutBadge[] {
  const badges: StatCalloutBadge[] = [];
  if (!transcript || transcript.length === 0) return badges;

  // Regex patterns to detect stats, numbers with units (K, M, %), CTR, Views, Subscribers, etc.
  const statRegex = /(\d+(?:\.\d+)?(?:\s*%|\s*[kKmMbB]|\s*views|\s*subscribers|\s*ctr|\s*subscribers)?)/i;

  transcript.forEach((chunk, index) => {
    const text = chunk.text.trim();
    if (statRegex.test(text) && text.length < 40) {
      const match = text.match(statRegex);
      if (match) {
        const val = match[0].toUpperCase();
        let trend: 'up' | 'down' | 'neutral' = 'neutral';
        if (
          text.toLowerCase().includes('grow') ||
          text.toLowerCase().includes('up') ||
          text.toLowerCase().includes('increase') ||
          text.toLowerCase().includes('blow up') ||
          text.toLowerCase().includes('high')
        ) {
          trend = 'up';
        } else if (
          text.toLowerCase().includes('drop') ||
          text.toLowerCase().includes('down') ||
          text.toLowerCase().includes('low') ||
          text.toLowerCase().includes('decrease') ||
          text.toLowerCase().includes('fall')
        ) {
          trend = 'down';
        }

        badges.push({
          id: `badge-${index}`,
          startFrame: Math.floor(chunk.start * fps),
          endFrame: Math.floor((chunk.end + 2) * fps),
          label: text,
          value: val,
          trend,
          connectorLine: true,
        });
      }
    }
  });

  return badges;
}
