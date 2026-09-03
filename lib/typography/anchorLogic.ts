/**
 * Dynamic Content-Aware Positioning & Visual Heatmap
 */

export interface SubjectPosition {
  x: number; // 0 to 1
  y: number; // 0 to 1
  width: number;
  height: number;
  confidence?: number;
}

export interface VisualHeatmap {
  occupiedRegions: Array<{ x: number; y: number; width: number; height: number }>;
  canvasWidth: number;
  canvasHeight: number;
}

export type AdaptiveContext = 'hero_lead' | 'lower_third' | 'top_callout' | 'center_stack';

export function analyzeVisualHeatmap(
  subjects: SubjectPosition[],
  canvasWidth = 1080,
  canvasHeight = 1920
): VisualHeatmap {
  return {
    occupiedRegions: subjects.map((s) => ({
      x: s.x * canvasWidth,
      y: s.y * canvasHeight,
      width: s.width * canvasWidth,
      height: s.height * canvasHeight,
    })),
    canvasWidth,
    canvasHeight,
  };
}

export function detectAdaptiveContext(fn: string, importance: number): AdaptiveContext {
  if (fn === 'headline' || importance > 0.8) {
    return 'hero_lead';
  }
  if (fn === 'call_to_action' || fn === 'key_statistic') {
    return 'top_callout';
  }
  return 'lower_third';
}

export function calculateContentAwarePosition(
  heatmap: VisualHeatmap,
  context: AdaptiveContext,
  importance: number
): {
  x: number;
  y: number;
  alignment: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
  maxWidth: number;
  region: 'top' | 'middle' | 'bottom';
} {
  // If subject is occupying center/lower half, shift to upper third
  const isOccupiedLower = heatmap.occupiedRegions.some((r) => r.y > heatmap.canvasHeight * 0.4);

  if (context === 'top_callout' || (isOccupiedLower && importance > 0.7)) {
    return {
      x: 0.5,
      y: 0.22,
      alignment: 'center',
      verticalAlign: 'top',
      maxWidth: 920,
      region: 'top',
    };
  }

  if (context === 'hero_lead') {
    return {
      x: 0.5,
      y: 0.65,
      alignment: 'center',
      verticalAlign: 'center',
      maxWidth: 960,
      region: 'middle',
    };
  }

  // Default lower third
  return {
    x: 0.5,
    y: 0.72,
    alignment: 'center',
    verticalAlign: 'bottom',
    maxWidth: 920,
    region: 'bottom',
  };
}
