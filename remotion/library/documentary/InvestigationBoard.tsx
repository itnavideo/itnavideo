import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface SuspectEntry {
  id: string;
  name: string;
  role: string;
  status: 'VERIFIED' | 'PERSON OF INTEREST' | 'CLEAR' | 'UNKNOWN';
  photoUrl?: string;
}

export interface InvestigationBoardProps {
  caseTitle?: string;
  leadInvestigator?: string;
  suspects?: SuspectEntry[];
  className?: string;
}

const DEFAULT_SUSPECTS: SuspectEntry[] = [
  { id: '1', name: 'VICTOR K.', role: 'Chief Engineer', status: 'PERSON OF INTEREST' },
  { id: '2', name: 'MARCUS V.', role: 'Logistics Broker', status: 'VERIFIED' },
  { id: '3', name: 'ELENA S.', role: 'Diplomatic Attache', status: 'UNKNOWN' },
];

export const InvestigationBoard: React.FC<InvestigationBoardProps> = ({
  caseTitle = 'OPERATION COLD SHADOW',
  leadInvestigator = 'AGENT R. VANCE',
  suspects = DEFAULT_SUSPECTS,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boardEntry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 75 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl select-none ${className}`}
      style={{
        opacity: boardEntry,
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-red-500 font-bold">
            INVESTIGATION ROSTER
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {caseTitle}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase text-zinc-500">LEAD SPECIAL AGENT</div>
          <div className="text-xs font-mono font-semibold text-zinc-300">{leadInvestigator}</div>
        </div>
      </div>

      {/* Suspect Roster Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suspects.map((suspect, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 85 },
          });

          const statusColor =
            suspect.status === 'VERIFIED'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : suspect.status === 'PERSON OF INTEREST'
              ? 'bg-red-500/20 text-red-400 border-red-500/40'
              : 'bg-zinc-800 text-zinc-400 border-zinc-700';

          return (
            <div
              key={suspect.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center text-center shadow-lg"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              {/* Profile Avatar Silhouette */}
              <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-zinc-500 mb-3 overflow-hidden">
                {suspect.photoUrl ? (
                  <img src={suspect.photoUrl} alt={suspect.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              {/* Name & Role */}
              <h4 className="text-sm font-serif font-bold text-zinc-100 uppercase tracking-wider mb-0.5">
                {suspect.name}
              </h4>
              <p className="text-[11px] font-mono text-zinc-400 mb-3">{suspect.role}</p>

              {/* Status Badge */}
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${statusColor}`}>
                {suspect.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
