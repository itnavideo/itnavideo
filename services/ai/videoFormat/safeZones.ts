export type CanvasAspectRatio = '9:16';
export type VisualSafeFrameRatio = '4:5' | '1:1';

export const VIDEO_CANVAS = {
  aspectRatio: '9:16' as CanvasAspectRatio,
  width: 1080,
  height: 1920,
  fps: 30 as const,
};

export const VISUAL_SAFE_FRAMES = {
  portrait_4_5: {
    ratio: '4:5' as VisualSafeFrameRatio,
    width: 1080,
    height: 1350,
    x: 0,
    y: 285,
  },
  square_1_1: {
    ratio: '1:1' as VisualSafeFrameRatio,
    width: 1080,
    height: 1080,
    x: 0,
    y: 420,
  },
};

export function pickSafeFrameForScene(input: {
  sourceType: string;
  role: string;
}): VisualSafeFrameRatio {
  if (input.sourceType.includes('graphic') || input.role === 'cta') {
    return '1:1';
  }

  return '4:5';
}
