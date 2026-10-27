import React from 'react';
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { getStickerPackPreset } from '../../../services/templates/templateLibrary';

export interface StickerEvent {
  id: string;
  stickerId: string;
  start: number; // in seconds
  end: number;   // in seconds
  position?: 'top-right' | 'top-left' | 'center-right' | 'center-left' | 'bottom-right';
}

export interface UniversalStickerLayerProps {
  stickerEvents: StickerEvent[];
  stickerPackId?: string;
}

const S3_REMOTION_BASE_URL = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com';

function resolveStickerSrc(rawSrc?: string): string {
  if (!rawSrc) return '';
  if (/^(https?:|data:|blob:)/i.test(rawSrc)) return rawSrc;
  const clean = rawSrc.replace(/^\/+/, '');
  if (clean.startsWith('assets/')) {
    const encoded = clean
      .split('/')
      .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
      .join('/');
    return `${S3_REMOTION_BASE_URL}/${encoded}`;
  }
  return staticFile(clean);
}

export const UniversalStickerLayer: React.FC<UniversalStickerLayerProps> = ({
  stickerEvents,
  stickerPackId = 'none',
}) => {
  if (!stickerPackId || stickerPackId === 'none' || !stickerEvents || stickerEvents.length === 0) {
    return null;
  }

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const pack = getStickerPackPreset(stickerPackId);

  const activeEvents = stickerEvents.filter(
    (ev) => currentTime >= ev.start && currentTime <= ev.end
  );

  if (activeEvents.length === 0) return null;

  return (
    <>
      {activeEvents.map((ev) => {
        const item = pack.stickers.find((s) => s.id === ev.stickerId) || pack.stickers[0];
        if (!item) return null;

        const startFrame = Math.floor(ev.start * fps);
        const enterSpring = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 12, stiffness: 160 },
        });

        const imageSrc = resolveStickerSrc(item.src);
        const pos = ev.position || 'bottom-right';

        let positionStyles: React.CSSProperties = {
          position: 'absolute',
          right: 90,
          bottom: 110,
        };

        if (pos === 'top-left') {
          positionStyles = { position: 'absolute', left: 90, top: 100 };
        } else if (pos === 'top-right') {
          positionStyles = { position: 'absolute', right: 90, top: 100 };
        } else if (pos === 'center-left') {
          positionStyles = { position: 'absolute', left: 90, top: '40%' };
        } else if (pos === 'center-right') {
          positionStyles = { position: 'absolute', right: 90, top: '38%' };
        } else if (pos === 'bottom-right') {
          positionStyles = { position: 'absolute', right: 90, bottom: 110 };
        }

        const floatBob = Math.sin((frame - startFrame) / 14) * 6;
        const subtleRotate = Math.sin((frame - startFrame) / 20) * 2;

        return (
          <div
            key={ev.id}
            style={{
              ...positionStyles,
              transform: `translateY(${floatBob}px) scale(${enterSpring}) rotate(${subtleRotate}deg)`,
              transformOrigin: 'bottom center',
              zIndex: 45,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 16px rgba(255, 160, 0, 0.25))',
            }}
          >
            <Img
              src={imageSrc}
              style={{
                width: 290,
                height: 'auto',
                maxHeight: 380,
                objectFit: 'contain',
              }}
            />
          </div>
        );
      })}
    </>
  );
};
