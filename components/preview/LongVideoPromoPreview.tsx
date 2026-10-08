'use client';

import { useEffect, useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { LongVideoPromo } from '@/remotion/templates/LONG_VIDEO_PROMO/template';
import { DEFAULT_FPS } from '@/remotion/constants';
import { Sparkles, Clock, Target, PlayCircle, Layers } from 'lucide-react';

const PREVIEW_FPS = DEFAULT_FPS;
const PREVIEW_SECONDS = 10;

/**
 * Live WYSIWYG preview for Long Video Promo. Renders the actual 9:16 Remotion composition
 * with real-time video, thumbnail, title, goal-derived CTA, animated captions, and creator handle.
 */
export function LongVideoPromoPreview({
  thumbnailFile,
  clipFile,
  title,
  promoGoal = 'watch-full-video',
  promoCreatorHandle = '',
}: {
  thumbnailFile: File | null;
  clipFile: File | null;
  title: string;
  promoGoal?: 'watch-full-video' | 'subscribers' | 'promote-episode';
  promoCreatorHandle?: string;
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

  // Demo sample captions for live preview motion demonstration
  const sampleCaptions = useMemo(
    () => [
      { text: 'I lost everything in 30 days...', start: 0.5, end: 3.2 },
      { text: 'And this one decision changed everything.', start: 3.5, end: 6.8 },
      { text: 'Watch the full video to see how.', start: 7.0, end: 9.8 },
    ],
    []
  );

  const sampleThumbUrl = thumbUrl || "/visuals/homepage/longvideopromo.1.png";
  const sampleMediaUrl = clipUrl || "/visuals/homepage/longvideoclips.mp4";

  const inputProps = useMemo(
    () => ({
      thumbnailSrc: sampleThumbUrl,
      mediaSrc: sampleMediaUrl,
      mediaAspect: 'landscape' as const,
      title: title?.trim() || 'How I Built a 7-Figure Business in 12 Months',
      promoGoal,
      promoCreatorHandle: promoCreatorHandle?.trim() || 'creator',
      promoCtaStyle: 'youtube-red' as const,
      promoBackgroundMode: 'blur' as const,
      accentColor: '#FF6D00',
      captions: sampleCaptions,
      durationSeconds: PREVIEW_SECONDS,
      fastRender: true,
      premiumEditing: false,
      sourceAudioVolume: 0,
    }),
    [sampleThumbUrl, sampleMediaUrl, title, promoGoal, promoCreatorHandle, sampleCaptions]
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* 9:16 VisionOS Glass Phone Stage */}
      <div
        className="relative overflow-hidden rounded-[24px] border border-white/15 bg-black shadow-[0_24px_50px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
        style={{ height: 'min(48vh, 440px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
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

      {/* Point 10: AI Intelligence Insight Card */}
      <div className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFA726]">
            <Sparkles size={14} className="text-[#FF6D00]" />
            <span>AI Promo Intelligence</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
            <Clock size={10} />
            Auto-Hook Ready
          </span>
        </div>

        <div className="mt-2.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5">
              <PlayCircle size={12} className="text-zinc-500" />
              AI Selected Clip:
            </span>
            <span className="font-semibold text-zinc-200">~32s Hook Segment</span>
          </div>

          <div className="flex items-start justify-between text-zinc-400 gap-2">
            <span className="flex items-center gap-1.5 shrink-0">
              <Target size={12} className="text-zinc-500" />
              Viral Hook:
            </span>
            <span className="font-medium text-amber-200 text-right truncate max-w-[190px]">
              &ldquo;I lost everything in 30 days...&rdquo;
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Layers size={12} className="text-zinc-500" />
              Structure:
            </span>
            <span className="font-semibold text-zinc-300 text-[11px]">
              Intro Flash → Hook & Subtitles → Outro Card
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
