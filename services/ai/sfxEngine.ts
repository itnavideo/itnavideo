/**
 * Timed Sound Effects (SFX) Sync Engine
 *
 * Calculates frame-exact audio triggers for scene transitions and graphic pop-ins.
 * Uses bundled static SFX files that render reliably inside Remotion Lambda.
 */

export interface TimedSfxEvent {
  id: string;
  sfxType: 'pop' | 'whoosh' | 'chime' | 'rise' | string;
  startFrame: number;
  volume: number;
  sfxUrl: string;
}

const SFX_URLS: Record<string, string> = {
  pop: 'assets/sfx/compare/compare-click.mp3',
  whoosh: 'assets/sfx/compare/compare-whoosh.mp3',
  chime: 'assets/sfx/compare/compare-ding.mp3',
  rise: 'assets/sfx/compare/compare-riser.mp3',
};

import { DEFAULT_FPS } from '../../remotion/constants';

export function generateSFXEvents(
  scenes: {
    sceneNumber: number;
    duration: number;
    SFX: 'pop' | 'woosh' | 'whoosh' | 'chime' | 'rise' | 'none' | string;
    narrationSegment: { startSeconds: number };
  }[],
  fps: number = DEFAULT_FPS
): TimedSfxEvent[] {
  const events: TimedSfxEvent[] = [];

  scenes.forEach((scene, idx) => {
    if (scene.SFX && scene.SFX !== 'none') {
      const startFrame = Math.round(scene.narrationSegment.startSeconds * fps);
      const url = SFX_URLS[scene.SFX] || SFX_URLS.pop;

      events.push({
        id: `sfx-${scene.sceneNumber}-${idx}`,
        sfxType: scene.SFX,
        startFrame,
        volume: 0.6,
        sfxUrl: url,
      });
    }
  });

  return events;
}
