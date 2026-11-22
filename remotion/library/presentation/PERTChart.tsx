import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface PERTNode {
  id: string;
  name: string;
  duration: number; // in days
  es: number; // Early Start
  ef: number; // Early Finish
  ls: number; // Late Start
  lf: number; // Late Finish
  isCritical?: boolean;
  x: number; // % coordinates
  y: number; // % coordinates
}

export interface PERTConnection {
  from: string;
  to: string;
}

export interface PERTChartProps {
  title?: string;
  nodes?: PERTNode[];
  connections?: PERTConnection[];
  className?: string;
}

const DEFAULT_NODES: PERTNode[] = [
  { id: 'A', name: 'UI Spec', duration: 3, es: 0, ef: 3, ls: 0, lf: 3, isCritical: true, x: 15, y: 50 },
  { id: 'B', name: 'API Schema', duration: 4, es: 3, ef: 7, ls: 3, lf: 7, isCritical: true, x: 45, y: 30 },
  { id: 'C', name: 'Copywriting', duration: 2, es: 3, ef: 5, ls: 5, lf: 7, isCritical: false, x: 45, y: 70 },
  { id: 'D', name: 'Production', duration: 5, es: 7, ef: 12, ls: 7, lf: 12, isCritical: true, x: 80, y: 50 },
];

const DEFAULT_CONNECTIONS: PERTConnection[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'D' },
];

export const PERTChart: React.FC<PERTChartProps> = ({
  title = 'CRITICAL PATH METHOD (CPM / PERT NETWORK)',
  nodes = DEFAULT_NODES,
  connections = DEFAULT_CONNECTIONS,
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
          <div className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">
            CPM WORKFLOW
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            CRITICAL PATH
          </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[16/8] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6">
        {/* SVG Arrow Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker id="pert-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
            </marker>
            <marker id="pert-arrow-crit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
          </defs>

          {connections.map((c, i) => {
            const n1 = nodes.find((n) => n.id === c.from);
            const n2 = nodes.find((n) => n.id === c.to);
            if (!n1 || !n2) return null;

            const isCrit = n1.isCritical && n2.isCritical;

            return (
              <line
                key={i}
                x1={`${n1.x}%`}
                y1={`${n1.y}%`}
                x2={`${n2.x}%`}
                y2={`${n2.y}%`}
                stroke={isCrit ? '#ef4444' : '#52525b'}
                strokeWidth={isCrit ? 3 : 2}
                strokeDasharray={isCrit ? undefined : '4 2'}
                markerEnd={isCrit ? 'url(#pert-arrow-crit)' : 'url(#pert-arrow)'}
              />
            );
          })}
        </svg>

        {/* Nodes Grid */}
        {nodes.map((node, idx) => {
          const nodeSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2.5 z-20 shadow-xl transition-all ${
                node.isCritical
                  ? 'bg-zinc-950 border-red-500 text-zinc-100 shadow-red-950/40'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300'
              }`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${nodeSpring})`,
                opacity: nodeSpring,
                width: '120px',
              }}
            >
              <div className="flex items-center justify-between text-[9px] font-mono border-b border-zinc-800 pb-1 mb-1">
                <span>ES: {node.es}</span>
                <span className="font-bold text-amber-400">{node.duration}d</span>
                <span>EF: {node.ef}</span>
              </div>
              <div className="text-center font-bold font-serif text-xs truncate">
                {node.name}
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono border-t border-zinc-800 pt-1 mt-1 text-zinc-500">
                <span>LS: {node.ls}</span>
                <span>LF: {node.lf}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
