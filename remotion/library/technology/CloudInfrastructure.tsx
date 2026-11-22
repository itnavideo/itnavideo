import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface CloudNode {
  id: string;
  name: string;
  provider: 'GCP' | 'AWS' | 'CLOUDINARY' | 'SUPABASE';
  role: string;
  status: string;
  color: string;
}

export interface CloudInfrastructureProps {
  title?: string;
  nodes?: CloudNode[];
  className?: string;
}

const DEFAULT_NODES: CloudNode[] = [
  { id: '1', name: 'Google Cloud Run', provider: 'GCP', role: 'Next.js App Server (us-central1)', status: 'ACTIVE', color: '#4285f4' },
  { id: '2', name: 'AWS Lambda Remotion', provider: 'AWS', role: '30fps Cloud Rendering (us-east-1)', status: '200 CONCURRENT', color: '#ff9900' },
  { id: '3', name: 'Supabase PostgreSQL', provider: 'SUPABASE', role: 'Auth, Jobs & RLS Storage', status: 'HEALTHY', color: '#3ecf8e' },
  { id: '4', name: 'Cloudinary CDN', provider: 'CLOUDINARY', role: 'Global Static Asset Edge', status: 'OPTIMIZED', color: '#0052cc' },
];

export const CloudInfrastructure: React.FC<CloudInfrastructureProps> = ({
  title = 'ITNAVIDEO CLOUD INFRASTRUCTURE ARCHITECTURE',
  nodes = DEFAULT_NODES,
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
            MULTI-CLOUD ARCHITECTURE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">ZERO LOCAL COMPUTE</span>
      </div>

      {/* Cloud Service Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {nodes.map((node, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={node.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-lg"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderLeftColor: node.color,
                borderLeftWidth: '4px',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${node.color}22`,
                      color: node.color,
                    }}
                  >
                    {node.provider}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    ● {node.status}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-serif font-black text-zinc-100 uppercase">
                  {node.name}
                </h4>
                <p className="text-xs font-mono text-zinc-400 mt-1">{node.role}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>VPC PEERING ENCRYPTED</span>
                <span className="text-zinc-400">TLS 1.3</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
