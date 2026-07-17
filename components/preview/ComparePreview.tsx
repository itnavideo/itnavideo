'use client';

import { useEffect, useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { CompareExplainer } from '@/remotion/templates/COMPARE_EXPLAINER/template';

const PREVIEW_FPS = 30;
const PREVIEW_SECONDS = 12;

/**
 * Live WYSIWYG preview for Compare Explainer. Renders the same Remotion composition
 * with the user's real titles, uploaded images, theme, tone, winner and sticker so
 * the layout is visible before render. Sample captions/poses are used for motion only;
 * the real ones come from the transcript at render time.
 */
export function ComparePreview({
  files,
  leftTitle,
  rightTitle,
  handle,
  themeId,
  tone,
  winner,
  stickerStyle,
}: {
  files: File[];
  leftTitle: string;
  rightTitle: string;
  handle: string;
  themeId: string;
  tone: string;
  winner: string;
  stickerStyle: string;
}) {
  // Turn uploaded files into object URLs so the preview shows the real visuals.
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.slice(0, 2).map((file) => URL.createObjectURL(file));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const inputProps = useMemo(
    () => ({
      mediaType: 'audio' as const,
      durationSeconds: PREVIEW_SECONDS,
      comparisonImageUrls: urls,
      compareLeftTitle: leftTitle?.trim() || 'Option A',
      compareRightTitle: rightTitle?.trim() || 'Option B',
      creatorHandle: handle?.trim() || '@itnavideo',
      themeId,
      tone,
      winner,
      stickerStyle,
      topicTitle: leftTitle && rightTitle ? `${leftTitle} vs ${rightTitle}` : '',
      premiumEditing: false,
      captions: [
        { start: 2, end: 5.5, text: 'Yahan aata hai pehla point' },
        { start: 5.7, end: 9, text: 'Aur yahan dusra point' },
      ],
    }),
    [urls, leftTitle, rightTitle, handle, themeId, tone, winner, stickerStyle],
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        style={{ height: 'min(46vh, 420px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
      >
        <Player
          component={CompareExplainer}
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
      <p className="mt-2 max-w-[300px] text-center text-[10px] leading-4 text-zinc-500">
        Live layout preview · your captions & poses come from the uploaded voiceover
      </p>
    </div>
  );
}
