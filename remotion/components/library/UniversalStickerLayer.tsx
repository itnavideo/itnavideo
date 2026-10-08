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

export const UniversalStickerLayer: React.FC<UniversalStickerLayerProps> = ({
  stickerEvents,
  stickerPackId = 'stickman-dev',
}) => {
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
          config: { damping: 10, stiffness: 180 },
        });

        const rawSrc = item.src || '';
        const imageSrc = rawSrc.startsWith('http')
          ? rawSrc
          : rawSrc.includes('visuals/stickers')
          ? staticFile(rawSrc)
          : staticFile('visuals/stickers/stickman-explainer.png');
        const pos = ev.position || 'center-right';

        let positionStyles: React.CSSProperties = {
          position: 'absolute',
          right: 80,
          top: '30%',
        };

        if (pos === 'top-left') {
          positionStyles = { position: 'absolute', left: 80, top: 100 };
        } else if (pos === 'top-right') {
          positionStyles = { position: 'absolute', right: 80, top: 100 };
        } else if (pos === 'center-left') {
          positionStyles = { position: 'absolute', left: 80, top: '35%' };
        } else if (pos === 'bottom-right') {
          positionStyles = { position: 'absolute', right: 80, bottom: 120 };
        }

        return (
          <div
            key={ev.id}
            style={{
              ...positionStyles,
              transform: `scale(${enterSpring}) rotate(${Math.sin(frame / 10) * 3}deg)`,
              zIndex: 40,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
            }}
          >
            <Img
              src={imageSrc}
              style={{
                width: 220,
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        );
      })}
    </>
  );
};
