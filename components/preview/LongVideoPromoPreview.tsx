'use client';

import { useEffect, useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { LongVideoPromo } from '@/remotion/templates/LONG_VIDEO_PROMO/template';
import { DEFAULT_FPS } from '@/remotion/constants';

const PREVIEW_FPS = DEFAULT_FPS;
const PREVIEW_SECONDS = 10;

/**
 * Live WYSIWYG preview for Long Video Promo. Renders the same Remotion composition
 * with the user's real thumbnail, title, CTA and (if uploaded) the promo clip, so the
 * layout, "FULL VIDEO" badge, arrow, and CTA pill are visible before render.
 */
export function LongVideoPromoPreview({
  thumbnailFile,
  clipFile,
  title,
  ctaText,
  mediaAspect,
}: {
  thumbnailFile: File | null;
  clipFile: File | null;
  title: string;
  ctaText: string;
  mediaAspect?: string;
}) {
  const [thumbUrl, setThumbUrl] = useState('');
  const [clipUrl, setClipUrl] = useState('');

  useEffect(() => {
    if (!thumbnailFile) { setThumbUrl(''); return; }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  useEffect(() => {
    if (!clipFile) { setClipUrl(''); return; }
    const url = URL.createObjectURL(clipFile);
    setClipUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [clipFile]);

  const inputProps = useMemo(
    () => ({
      thumbnailSrc: thumbUrl,
      mediaSrc: clipUrl,
      mediaAspect: (mediaAspect as 'landscape' | 'portrait' | '1:1' | undefined) || 'landscape',
      title: title?.trim() || 'Your YouTube video title goes here',
      ctaText: ctaText?.trim() || 'Watch the full video',
      ctaSubtext: 'Link in bio',
      durationSeconds: PREVIEW_SECONDS,
      fastRender: true,
      premiumEditing: false,
      sourceAudioVolume: 0,
    }),
    [thumbUrl, clipUrl, title, ctaText, mediaAspect],
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        style={{ height: 'min(46vh, 420px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
      >
        <Player
          component={LongVideoPromo}
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
          acknowledgeRemotionLicense
        />
      </div>
      <p className="mt-2 max-w-[300px] text-center text-[10px] leading-4 text-zinc-500">
        Live layout preview · upload a thumbnail and clip to see the full promo
      </p>
    </div>
  );
}
