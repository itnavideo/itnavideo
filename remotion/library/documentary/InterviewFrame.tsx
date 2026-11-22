import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface InterviewFrameProps {
  children?: React.ReactNode;
  speakerName?: string;
  role?: string;
  institution?: string;
  location?: string;
  audioWaveform?: boolean;
  className?: string;
}

export const InterviewFrame: React.FC<InterviewFrameProps> = ({
  children,
  speakerName = 'DR. ALISTAIR FINCH',
  role = 'Former Senior Cryptanalyst',
  institution = 'GCHQ • Signals Intelligence (Ret.)',
  location = 'LONDON, UNITED KINGDOM',
  audioWaveform = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lowerThirdEntry = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 80 },
  });

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Video Content / Talking Head */}
      <div className="relative w-full h-full">{children}</div>

      {/* Documentary Interview Lower Third Overlay */}
      <div
        className="absolute bottom-8 left-8 z-30 flex flex-col bg-zinc-950/85 border-l-4 border-l-red-600 border-y border-r border-zinc-800 rounded-r-xl p-4 sm:p-5 shadow-2xl backdrop-blur-md max-w-md select-none"
        style={{
          transform: `translateX(${(1 - lowerThirdEntry) * -30}px)`,
          opacity: lowerThirdEntry,
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
          <span>{location}</span>
          {audioWaveform && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-red-500 rounded-full"
                  style={{
                    height: `${4 + (Math.sin(frame * 0.4 + i) * 6 + 6)}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
          {speakerName}
        </h3>
        <p className="text-xs font-sans text-amber-400 font-semibold">{role}</p>
        <p className="text-[11px] font-sans text-zinc-400 mt-0.5">{institution}</p>
      </div>
    </div>
  );
};
