import React from 'react';
import { Captions, Clapperboard, Download, Sparkles, Upload } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Clapperboard,
    title: 'Choose a Video Type',
    desc: 'Pick a video type — each one has its own upload flow and output style.',
    accent: '#2563EB',
  },
  {
    number: '02',
    icon: Upload,
    title: 'Upload your content',
    desc: 'Video, audio, or images. The upload area adapts to your chosen video type.',
    accent: '#06b6d4',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'AI transcribes & plans',
    desc: 'Speech becomes timed subtitles. AI builds the layout, captions, and visuals.',
    accent: '#3b82f6',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download your reel',
    desc: 'Get a 9:16 MP4 ready for Instagram Reels, YouTube Shorts, and TikTok.',
    accent: '#10b981',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-background px-5 py-24 sm:px-6 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(6,182,212,0.03),transparent_100%)]" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-500 dark:text-cyan-400">How it works</p>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl font-sans">
              Upload once. Get a reel back.
            </h2>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] px-4.5 py-3 text-xs font-bold text-blue-600 dark:text-blue-200 backdrop-blur-md">
            <Captions size={16} className="text-cyan-500 dark:text-cyan-400" />
            One plan unlocks all video types
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm backdrop-blur-md hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 dark:border-border dark:bg-muted/40 dark:hover:border-blue-500/50 transition duration-300 group">
                {/* Large Background Watermark Step Number */}
                <span className="pointer-events-none absolute -bottom-4 -right-2 font-mono text-6xl font-black text-slate-900/[0.04] dark:text-white/[0.04] group-hover:text-blue-500/10 transition duration-500 select-none">
                  {step.number}
                </span>

                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white shadow-md" style={{ background: step.accent }}>
                    {step.number}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105" style={{ background: `${step.accent}15`, color: step.accent }}>
                    <Icon size={20} className="group-hover:scale-110 transition duration-300" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-card-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{step.title}</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

