import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface OrgLeader {
  role: string;
  name: string;
  color?: string;
  subordinates?: string[];
}

export interface OrganizationalHierarchyProps {
  companyName?: string;
  ceo?: OrgLeader;
  vpLeaders?: OrgLeader[];
  className?: string;
}

const DEFAULT_CEO: OrgLeader = {
  role: 'CHIEF EXECUTIVE OFFICER (CEO)',
  name: 'Founder & Visionary Lead',
  color: '#38bdf8',
};

const DEFAULT_VPS: OrgLeader[] = [
  { role: 'VP ENGINEERING', name: 'Cloud Run & Lambda Cluster', color: '#10b981', subordinates: ['Remotion Dev', 'DB Architect'] },
  { role: 'VP PRODUCT & AI', name: 'Studio & Reel Direction', color: '#6366f1', subordinates: ['Prompt Engineer', 'UI/UX Lead'] },
  { role: 'VP GROWTH & REVENUE', name: 'Marketing & Partnerships', color: '#f59e0b', subordinates: ['SEO Manager', 'Affiliate Ops'] },
];

export const OrganizationalHierarchy: React.FC<OrganizationalHierarchyProps> = ({
  companyName = 'ITNAVIDEO INC. LEADERSHIP STRUCTURE',
  ceo = DEFAULT_CEO,
  vpLeaders = DEFAULT_VPS,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            LEADERSHIP STRUCTURE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {companyName}
          </h3>
        </div>
      </div>

      {/* CEO Top Card */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-zinc-900 border-2 border-sky-400 rounded-xl px-6 py-3 text-center shadow-lg">
          <div className="text-xs font-serif font-black text-sky-400 uppercase">{ceo.role}</div>
          <div className="text-[11px] font-mono text-zinc-300">{ceo.name}</div>
        </div>
        <div className="w-[2px] h-6 bg-zinc-700" />
      </div>

      {/* VP Tier Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vpLeaders.map((vp, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-md"
            style={{ borderTopColor: vp.color, borderTopWidth: '3px' }}
          >
            <div className="text-xs font-serif font-bold text-zinc-100 uppercase">{vp.role}</div>
            <div className="text-[10px] font-mono text-zinc-400 mb-3">{vp.name}</div>

            {vp.subordinates && (
              <div className="space-y-1 border-t border-zinc-800 pt-2 text-[10px] font-mono text-zinc-400">
                {vp.subordinates.map((sub, sIdx) => (
                  <div key={sIdx}>↳ {sub}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
