'use client';

import { useMemo } from 'react';
import { Player } from '@remotion/player';
import { CaptionStudioReel } from '@/remotion/templates/CAPTION_STUDIO/template';

export type CaptionStudioPreviewSettings = {
  fontFamily: string;
  fontSizePx: number;
  fontWeight: number;
  italic: boolean;
  textCase: 'as-is' | 'uppercase' | 'title' | 'lowercase';
  letterSpacingEm: number;
  lineHeight: number;
  textColor: string;
  activeWordColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundShape: 'pill' | 'rounded' | 'square' | 'none';
  paddingPx: number;
  strokeWidthPx: number;
  strokeColor: string;
  shadow: 'none' | 'soft' | 'hard';
  rotationDeg: number;
  position: 'bottom' | 'center' | 'top';
  horizontalAlign: 'left' | 'center' | 'right';
  maxWidthPercent: number;
  entryAnimation: 'none' | 'fade' | 'slide-up' | 'pop';
  emphasisMode: 'color' | 'scale' | 'box' | 'underline' | 'none';
  wordsPerGroup: number;
};

const PREVIEW_FPS = 30;
const PREVIEW_SECONDS = 6;
const SAMPLE_WORDS = ['This', 'is', 'your', 'caption', 'style', 'preview', 'update', 'it', 'live', 'in', 'real', 'time'];

/**
 * Live WYSIWYG preview for Caption Studio. Renders the same Remotion composition
 * used for the final export, driven by the user's current manual settings and a
 * short synthetic caption so styling, animation, emphasis, and grouping are visible
 * before spending credits. Real captions come from the uploaded speech at render time.
 */
export function CaptionStudioPreview({
  settings,
  videoUrl,
}: {
  settings: CaptionStudioPreviewSettings;
  videoUrl?: string | null;
}) {
  const captions = useMemo(() => {
    const perWord = PREVIEW_SECONDS / SAMPLE_WORDS.length;
    const words = SAMPLE_WORDS.map((word, i) => ({
      word,
      start: Number((i * perWord).toFixed(2)),
      end: Number(((i + 1) * perWord).toFixed(2)),
    }));
    return [{ start: 0, end: PREVIEW_SECONDS, text: SAMPLE_WORDS.join(' '), words }];
  }, []);

  const inputProps = useMemo(
    () => ({
      ...settings,
      mediaSrc: videoUrl || '',
      mediaType: 'video' as const,
      sourceAudioVolume: 0,
      durationSeconds: PREVIEW_SECONDS,
      sourceDurationSeconds: PREVIEW_SECONDS,
      captions,
      subtitleChunks: captions,
    }),
    [settings, videoUrl, captions],
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* CapCut-style phone editor preview: large, height-capped for mobile, with playback controls */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        style={{ height: 'min(46vh, 420px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
      >
        <Player
          component={CaptionStudioReel}
          inputProps={inputProps}
          durationInFrames={PREVIEW_FPS * PREVIEW_SECONDS}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={PREVIEW_FPS}
          style={{ width: '100%', height: '100%' }}
          loop
          autoPlay
          controls
          clickToPlay
          spaceKeyToPlayOrPause
          acknowledgeRemotionLicense
        />
      </div>
      <p className="mt-2 max-w-[280px] text-center text-[10px] leading-4 text-zinc-500">
        Live style preview · your real captions come from the uploaded speech at render time
      </p>
    </div>
  );
}
