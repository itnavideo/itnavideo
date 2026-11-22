import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CaseFileProps {
  caseId?: string;
  subject?: string;
  classification?: 'TOP SECRET' | 'CONFIDENTIAL' | 'DECLASSIFIED' | 'RESTRICTED';
  dateOpened?: string;
  summaryText?: string;
  redactedPhrases?: string[];
  paperClip?: boolean;
  className?: string;
}

export const CaseFile: React.FC<CaseFileProps> = ({
  caseId = 'DOSSIER #774-ALPHA',
  subject = 'OPERATION DEEP HORIZON',
  classification = 'DECLASSIFIED',
  dateOpened = '14 MARCH 1978',
  summaryText = 'Surveillance log recorded unusual radar anomalies over Sector 9. Key witness statements corroborate unauthorized air traffic departing from restricted grid.',
  redactedPhrases = ['radar anomalies', 'unauthorized air traffic'],
  paperClip = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 70 },
  });

  const stampEntry = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 140 },
  });

  const stampColor =
    classification === 'DECLASSIFIED'
      ? '#10b981'
      : classification === 'TOP SECRET'
      ? '#ef4444'
      : '#f59e0b';

  return (
    <div
      className={`relative w-full max-w-xl bg-[#d4c5a9] text-zinc-900 rounded-sm p-8 shadow-2xl border border-[#b8a786] select-none ${className}`}
      style={{
        transform: `rotate(-1deg) scale(${entry})`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* Paper Clip Visual */}
      {paperClip && (
        <div className="absolute -top-3 right-10 w-4 h-12 border-2 border-zinc-400 rounded-full pointer-events-none z-30 shadow-md" />
      )}

      {/* Top Dossier Header Strip */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-700">
            DEPARTMENT OF NAVAL INTELLIGENCE
          </div>
          <div className="text-sm font-mono font-bold tracking-wider text-zinc-900">
            {caseId}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase text-zinc-600">DATE OPENED</div>
          <div className="text-xs font-mono font-semibold text-zinc-800">{dateOpened}</div>
        </div>
      </div>

      {/* Subject Line */}
      <div className="mb-4">
        <span className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mr-2">
          SUBJECT:
        </span>
        <span className="text-base font-serif font-black tracking-wide text-zinc-950 uppercase">
          {subject}
        </span>
      </div>

      {/* Narrative Summary with Redaction Blocks */}
      <div className="text-xs sm:text-sm font-mono leading-relaxed text-zinc-800 border-l-2 border-zinc-400 pl-4 py-1 mb-6">
        {summaryText.split(' ').map((word, idx) => {
          const isRedacted = redactedPhrases.some((phrase) =>
            phrase.toLowerCase().includes(word.toLowerCase().replace(/[^a-z0-9]/g, ''))
          );

          if (isRedacted) {
            return (
              <span
                key={idx}
                className="bg-zinc-950 text-zinc-950 px-1 py-0.5 rounded-xs select-none inline-block mr-1 font-sans"
              >
                ██████
              </span>
            );
          }
          return <span key={idx}>{word} </span>;
        })}
      </div>

      {/* Giant Rubber Stamp Overlay */}
      <div
        className="absolute top-1/2 right-12 -translate-y-1/2 border-4 rounded-sm px-4 py-2 font-mono font-black text-2xl sm:text-3xl tracking-widest uppercase pointer-events-none z-20"
        style={{
          borderColor: stampColor,
          color: stampColor,
          transform: `translateY(-50%) rotate(${interpolate(stampEntry, [0, 1], [-25, -12])}deg) scale(${stampEntry})`,
          opacity: stampEntry * 0.9,
          boxShadow: `inset 0 0 8px ${stampColor}40`,
        }}
      >
        {classification}
      </div>
    </div>
  );
};
