import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

export interface FreezeFrameProps {
  freezeAtFrame?: number;
  title?: string;
  subtitle?: string;
  stampColor?: string;
  className?: string;
}

export const FreezeFrame: React.FC<FreezeFrameProps> = ({
  freezeAtFrame = 40,
  title = 'THE MOMENT HE KNEW',
  subtitle = 'Target Locked • Error 404 Found',
  stampColor = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isFrozen = frame >= freezeAtFrame;
  const freezeAge = Math.max(0, frame - freezeAtFrame);

  const stampPop = spring({
    frame: freezeAge,
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  return (
    <div className={"relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-white " + className}>
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          filter: isFrozen ? 'grayscale(80%) contrast(140%)' : 'none',
          transform: isFrozen ? ('scale(' + (1 + freezeAge * 0.002) + ')') : 'none',
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-white/20 font-black text-6xl">
          ACTION FOOTAGE
        </div>
      </div>

      {isFrozen && (
        <div
          className="z-20 p-6 rounded-2xl bg-black/85 border-2 border-white/20 backdrop-blur-xl max-w-sm text-center shadow-2xl"
          style={{
            transform: 'scale(' + stampPop + ') rotate(' + (-3 + stampPop * 3) + 'deg)',
          }}
        >
          <div
            className="inline-block px-3 py-1 mb-3 rounded border text-xs font-mono font-black tracking-widest uppercase"
            style={{ borderColor: stampColor, color: stampColor }}
          >
            FREEZE FRAME
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2">{title}</h2>
          <p className="text-xs text-white/70 font-mono">{subtitle}</p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 font-mono text-xs text-white/50">
        STATE: {isFrozen ? ('FROZEN AT F:' + freezeAtFrame) : 'LIVE PLAYBACK'}
      </div>
    </div>
  );
};
