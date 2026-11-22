import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface PipelineStage {
  title: string;
  tool: string;
  throughput: string;
  color: string;
}

export interface DataPipelineProps {
  title?: string;
  stages?: PipelineStage[];
  className?: string;
}

const DEFAULT_STAGES: PipelineStage[] = [
  { title: 'AUDIO INGEST', tool: 'S3 Presigned URL', throughput: '150 req/sec', color: '#38bdf8' },
  { title: 'TRANSCRIPTION', tool: 'Groq Whisper V3', throughput: '12x Real-time', color: '#10b981' },
  { title: 'PLANNER AI', tool: 'Gemini 2.0 Flash', throughput: '800ms / script', color: '#f59e0b' },
  { title: 'CLOUD RENDER', tool: 'AWS Lambda 30fps', throughput: '2 min export', color: '#ec4899' },
];

export const DataPipeline: React.FC<DataPipelineProps> = ({
  title = 'REAL-TIME DATA STREAMING PIPELINE (ETL)',
  stages = DEFAULT_STAGES,
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
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            DATA PIPELINE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Sequential Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderTopColor: stage.color,
                borderTopWidth: '3px',
              }}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                  STAGE 0{idx + 1}
                </span>
                <h4 className="text-sm font-serif font-black text-zinc-100 uppercase mt-1">
                  {stage.title}
                </h4>
                <div className="text-xs font-mono text-zinc-400 mt-2 bg-zinc-950 p-2 rounded border border-zinc-800">
                  {stage.tool}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] font-mono font-bold" style={{ color: stage.color }}>
                ⚡ {stage.throughput}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
