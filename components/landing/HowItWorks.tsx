import React from 'react';
import { Captions, Download, LayoutTemplate, Sparkles, Upload } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload',
    desc: 'Add audio, video, or a voiceover with clear speech.',
  },
  {
    number: '02',
    icon: LayoutTemplate,
    title: 'Use Explainer Video',
    desc: 'One focused template keeps the source media visible and the story easy to follow.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Generate',
    desc: 'AI builds timing, scenes, captions, motion, and safe-zone layouts.',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download',
    desc: 'Export a vertical MP4 ready for Instagram Reels, Shorts, and TikTok.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#070707] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">How it works</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl md:text-6xl">
              Upload once. Get a reel back.
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
            <Captions size={18} className="text-cyan-300" />
            One focused template
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="rounded-lg border border-white/10 bg-zinc-950 p-6">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-zinc-600">{step.number}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

