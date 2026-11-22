import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BusinessModelCanvasProps {
  title?: string;
  valueProp?: string;
  customerSegments?: string;
  channels?: string;
  revenueStreams?: string;
  costStructure?: string;
  className?: string;
}

export const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({
  title = 'STRATEGYZER BUSINESS MODEL CANVAS (ITNAVIDEO)',
  valueProp = 'Autonomous studio-quality video creation in < 2 min with zero learning curve.',
  customerSegments = 'Solo creators, YouTubers, digital marketing agencies, course educators.',
  channels = 'Viral TikTok/Reels watermarks, Google SEO search, affiliate creators.',
  revenueStreams = 'Subscription plans ($19/$49/mo) + Pay-as-you-go credit packages.',
  costStructure = 'Google Cloud Run compute, AWS Lambda rendering, Groq Whisper transcription.',
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
            STRATEGYZER FRAMEWORK
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:col-span-1">
          <span className="text-[10px] text-sky-400 font-bold uppercase block mb-1">
            VALUE PROPOSITION
          </span>
          <p className="font-sans text-zinc-200">{valueProp}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:col-span-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
            CUSTOMER SEGMENTS
          </span>
          <p className="font-sans text-zinc-200">{customerSegments}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:col-span-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
            DISTRIBUTION CHANNELS
          </span>
          <p className="font-sans text-zinc-200">{channels}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:col-span-1.5 md:col-start-1">
          <span className="text-[10px] text-red-400 font-bold uppercase block mb-1">
            COST STRUCTURE
          </span>
          <p className="font-sans text-zinc-300">{costStructure}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:col-span-2">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
            REVENUE STREAMS
          </span>
          <p className="font-sans text-zinc-300">{revenueStreams}</p>
        </div>
      </div>
    </div>
  );
};
