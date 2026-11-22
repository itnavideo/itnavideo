import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface JumpCutProps {
  cuts?: { text?: string; scale?: number; offsetX?: number; offsetY?: number }[];
  cutInterval?: number;
  showStutterIndicator?: boolean;
  accentColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export const JumpCut: React.FC<JumpCutProps> = ({
  cuts = [
    { text: 'Take 1', scale: 1, offsetX: 0, offsetY: 0 },
    { text: 'Take 2', scale: 1.08, offsetX: 12, offsetY: -8 },
    { text: 'Take 3', scale: 1.15, offsetX: -14, offsetY: 10 },
    { text: 'Take 4', scale: 1.05, offsetX: 6, offsetY: -4 },
  ],
  cutInterval = 20,
  showStutterIndicator = true,
  accentColor = '#f97316',
  className = '',
  children,
}) => {
  const frame = useCurrentFrame();
  const currentIndex = Math.floor(frame / cutInterval) % cuts.length;
  const currentCut = cuts[currentIndex];
  const frameInCut = frame % cutInterval;

  const flash = frameInCut < 2 ? 0.35 : 0;
  const punchScale = currentCut.scale ?? 1;
  const tx = currentCut.offsetX ?? 0;
  const ty = currentCut.offsetY ?? 0;

  return (
    <div
      className={"relative overflow-hidden rounded-xl border border-white/10 bg-black/60 " + className}
      style={{
        width: '100%',
        height: '100%',
        transform: 'translate3d(' + tx + 'px, ' + ty + 'px, 0) scale(' + punchScale + ')',
        transition: 'transform 0.05s ease-out',
      }}
    >
      <div className="relative w-full h-full">
        {children || (
          <div className="flex flex-col items-center justify-center h-full text-white/80 p-6">
            <div className="text-4xl mb-2 font-mono font-bold tracking-widest uppercase">
              {currentCut.text || ('JUMP CUT #' + (currentIndex + 1))}
            </div>
            <div className="text-xs uppercase tracking-wider text-white/50">
              Frame {frameInCut} / {cutInterval} • Scale {(punchScale * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      {flash > 0 && (
        <div
          className="absolute inset-0 pointer-events-none bg-white mix-blend-screen"
          style={{ opacity: flash }}
        />
      )}

      {showStutterIndicator && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/75 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span className="text-[11px] font-mono tracking-wider font-semibold text-white">
            JUMP CUT [{currentIndex + 1}/{cuts.length}]
          </span>
        </div>
      )}
    </div>
  );
};
