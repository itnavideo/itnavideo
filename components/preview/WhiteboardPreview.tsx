'use client';

import { useMemo } from 'react';
import { Player } from '@remotion/player';
import { WhiteboardVideo } from '@/remotion/templates/WHITEBOARD_VIDEO/template';
import { DEFAULT_FPS } from '@/remotion/constants';

const PREVIEW_FPS = DEFAULT_FPS;
const PREVIEW_SECONDS = 12;

// Board id → Vercel-served preview image (public/assets board images are not deployed to Vercel).
const BOARD_PREVIEW_IMAGE: Record<string, string> = {
  'corporate-luxury': '/preview/board-corporate-luxury.jpg',
  classroom: '/preview/board-classroom.jpg',
  'dark-modern': '/preview/board-dark-modern.jpg',
  coworking: '/preview/board-coworking.jpg',
};

/**
 * Live WYSIWYG preview for Whiteboard Video. Renders the same Remotion composition
 * with sample points on the selected board so the writing animation, board scene,
 * and safe-zone fit are visible before render. Real points come from the transcript.
 */
export function WhiteboardPreview({ board }: { board: string }) {
  const inputProps = useMemo(
    () => ({
      mediaSrc: '',
      mediaType: 'audio' as const,
      durationSeconds: PREVIEW_SECONDS,
      boardStyle: board,
      boardImageUrl: BOARD_PREVIEW_IMAGE[board] || BOARD_PREVIEW_IMAGE['corporate-luxury'],
      title: '3 Key Points',
      points: [
        { text: 'Start with a clear idea', startTime: 1.2, endTime: 4.5, markerColor: '#2563EB', bulletType: 'number' as const, icon: 'lightbulb' as const },
        { text: 'Keep it simple and focused', startTime: 4.7, endTime: 8, markerColor: '#DC2626', bulletType: 'number' as const, isHighlight: true, icon: 'checkmark' as const },
        { text: 'Take action today', startTime: 8.2, endTime: 11.5, markerColor: '#16A34A', bulletType: 'number' as const, icon: 'arrow' as const },
      ],
      conclusion: 'action today',
      conclusionTime: 11,
    }),
    [board],
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        style={{ height: 'min(46vh, 420px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
      >
        <Player
          component={WhiteboardVideo}
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
        Live style preview · your real points come from the uploaded speech
      </p>
    </div>
  );
}
