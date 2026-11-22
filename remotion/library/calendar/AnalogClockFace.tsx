import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AnalogClockFaceProps {
  className?: string;
}

export const AnalogClockFace: React.FC<AnalogClockFaceProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const secAngle = (frame * 6) % 360;
  const minAngle = (frame * 0.5) % 360;
  const hourAngle = (frame * 0.04) % 360;

  return (
    <div className={"w-60 h-60 bg-zinc-950 border-2 border-white/20 rounded-full font-mono text-white shadow-2xl relative flex items-center justify-center " + className}>
      {/* Clock numerals */}
      <div className="absolute top-2 text-xs font-bold text-white/50">12</div>
      <div className="absolute right-3 text-xs font-bold text-white/50">3</div>
      <div className="absolute bottom-2 text-xs font-bold text-white/50">6</div>
      <div className="absolute left-3 text-xs font-bold text-white/50">9</div>
      {/* Hour Hand */}
      <div
        className="w-1.5 h-14 bg-white rounded-full absolute origin-bottom"
        style={{ transform: "rotate(" + hourAngle + "deg) translateY(-28px)" }}
      />
      {/* Minute Hand */}
      <div
        className="w-1 h-20 bg-sky-400 rounded-full absolute origin-bottom"
        style={{ transform: "rotate(" + minAngle + "deg) translateY(-40px)" }}
      />
      {/* Second Hand */}
      <div
        className="w-0.5 h-24 bg-red-500 rounded-full absolute origin-bottom"
        style={{ transform: "rotate(" + secAngle + "deg) translateY(-48px)" }}
      />
      {/* Center cap */}
      <div className="w-3 h-3 rounded-full bg-white z-10 shadow" />
    </div>
  );
};
