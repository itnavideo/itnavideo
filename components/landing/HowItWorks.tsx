import React from 'react';
import { Captions, Clapperboard, Download, Sparkles, Upload } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Clapperboard,
    title: 'Choose a Video Type',
    desc: 'Pick a video type — each one has its own upload flow and output style.',
    accent: '#60A5FA',
  },
  {
    number: '02',
    icon: Upload,
    title: 'Upload your content',
    desc: 'Video, audio, or images. The upload area adapts to your chosen video type.',
    accent: '#22C55E',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'AI transcribes & plans',
    desc: 'Speech becomes timed subtitles. AI builds the layout, captions, and visuals.',
    accent: '#F59E0B',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download your reel',
    desc: 'Get a 9:16 MP4 ready for Instagram Reels, YouTube Shorts, and TikTok.',
    accent: '#A78BFA',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24" style={{ background: '#0B1120' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-emerald-400">How it works</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl md:text-5xl">
              Upload once. Get a reel back.
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-300">
            <Captions size={18} className="text-emerald-400" />
            One plan unlocks all video types
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="rounded-xl border border-white/8 bg-white/[0.03] p-6">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: step.accent }}>
                    {step.number}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md" style={{ background: `${step.accent}15`, color: step.accent }}>
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
