'use client';

import { useEffect, useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { MultiImagesVideo } from '@/remotion/templates/MULTI_IMAGES_VIDEO/template';
import { DEFAULT_FPS } from '@/remotion/constants';

const PREVIEW_FPS = DEFAULT_FPS;
const PREVIEW_SECONDS = 12;

/**
 * Live WYSIWYG preview for Multi Images Video. Renders the same Remotion composition
 * with the user's real video, title, and images (in the chosen order) so the layout,
 * image order and motion are visible before render. Captions and narration-synced
 * image timing are added at render time from the transcript.
 */
export function MultiImagesPreview({
  clipFile,
  imageFiles,
  title,
}: {
  clipFile: File | null;
  imageFiles: File[];
  title: string;
}) {
  const [clipUrl, setClipUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!clipFile) { setClipUrl(''); return; }
    const url = URL.createObjectURL(clipFile);
    setClipUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [clipFile]);

  useEffect(() => {
    const urls = imageFiles.slice(0, 20).map((f) => URL.createObjectURL(f));
    setImageUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imageFiles]);

  const inputProps = useMemo(
    () => ({
      mediaSrc: clipUrl,
      sourceAudioVolume: 0,
      durationSeconds: PREVIEW_SECONDS,
      title: title?.trim() || 'Your story title here',
      imageSources: imageUrls,
    }),
    [clipUrl, imageUrls, title],
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        style={{ height: 'min(46vh, 420px)', aspectRatio: '9 / 16', maxWidth: '100%' }}
      >
        <Player
          component={MultiImagesVideo}
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
        Live layout preview · images change on speech beats and captions are added at render
      </p>
    </div>
  );
}
