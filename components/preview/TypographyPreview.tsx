'use client';

import { useMemo } from 'react';
import { Player } from '@remotion/player';
import { TypographyVideo } from '@/remotion/templates/TYPOGRAPHY_VIDEO/template';

const PREVIEW_FPS = 30;
const PREVIEW_SECONDS = 6;

/**
 * Live WYSIWYG preview for Typography Video. Renders the same Remotion composition
 * used for the final export with the user's selected style + caption settings, so
 * headline animation, color grade, and caption placement are visible before render.
 * Real keywords/captions come from the uploaded speech at render time.
 */
export function TypographyPreview({
  typographyStyle,
  captionStyle,
  captionPosition,
  showCaptions,
  videoUrl,
}: {
  typographyStyle: string;
  captionStyle: string;
  captionPosition: 'bottom' | 'center' | 'top';
  showCaptions: boolean;
  videoUrl?: string | null;
}) {
  const inputProps = useMemo(
    () => ({
      mediaSrc: videoUrl || '',
      mediaType: 'video' as const,
      sourceAudioVolume: 0,
      durationSeconds: PREVIEW_SECONDS,
      sourceDurationSeconds: PREVIEW_SECONDS,
      typographyStyle,
      captionStyle,
      captionPosition,
      showCaptions,
      premiumEditing: true,
      keywords: [
        { word: 'YOUR STORY', start: 0.3, end: 2.8, color: '', size: 'huge' as const, position: 'top' as const, emphasis: 'headline' as const },
        { word: 'big idea', start: 3.1, end: 5.7, color: '', size: 'large' as const, position: 'center' as const, emphasis: 'headline' as const },
      ],
      captions: [
        { start: 0.2, end: 3, text: 'this is your typography preview' },
        { start: 3, end: 6, text: 'real captions come from your speech' },
      ],
    }),
    [typographyStyle, captionStyle, captionPosition, showCaptions, videoUrl],
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        style={{ height: 'min(46vh, 420px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
      >
        <Player
          component={TypographyVideo}
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
        Live style preview · your real headline words come from the uploaded speech
      </p>
    </div>
  );
}
