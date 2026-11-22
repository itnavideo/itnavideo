import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ServiceNode {
  name: string;
  database: string;
  busEvent: string;
  color: string;
}

export interface MicroservicesDiagramProps {
  title?: string;
  services?: ServiceNode[];
  eventBroker?: string;
  className?: string;
}

const DEFAULT_SERVICES: ServiceNode[] = [
  { name: 'User & Billing Service', database: 'Supabase DB', busEvent: 'UserSubscribedEvent', color: '#10b981' },
  { name: 'Transcription Engine', database: 'Groq Cloud API', busEvent: 'AudioTranscribedEvent', color: '#38bdf8' },
  { name: 'Remotion Render Worker', database: 'AWS S3 Bucket', busEvent: 'RenderCompletedEvent', color: '#f59e0b' },
  { name: 'Webhook & Notifier', database: 'Redis Queue', busEvent: 'VideoDeliveredEvent', color: '#ec4899' },
];

export const MicroservicesDiagram: React.FC<MicroservicesDiagramProps> = ({
  title = 'DECOUPLED EVENT-DRIVEN MICROSERVICES MESH',
  services = DEFAULT_SERVICES,
  eventBroker = 'APACHE KAFKA / REDIS EVENT BUS',
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
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            DISTRIBUTED ARCHITECTURE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Central Event Bus Ribbon */}
      <div className="bg-zinc-900 border border-amber-500/60 rounded-xl px-4 py-2.5 text-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest">
          ⚡ {eventBroker} ⚡
        </span>
      </div>

      {/* Microservice Pods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((svc, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderTopColor: svc.color,
                borderTopWidth: '3px',
              }}
            >
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-zinc-100 uppercase mb-2">
                  {svc.name}
                </h4>
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                  DB: {svc.database}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500 truncate">
                PUB: <span style={{ color: svc.color }}>{svc.busEvent}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
