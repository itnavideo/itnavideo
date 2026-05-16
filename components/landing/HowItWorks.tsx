import React from 'react';
import { Clapperboard, Download, SlidersHorizontal, Sparkles, Upload } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload voiceover',
    desc: 'Start with one clear MP3, WAV, or M4A file. This MVP flow is audio-only.',
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    title: 'Choose the style',
    desc: 'Pick pacing, captions, and portrait export quality. Extra media uploads are paused for now.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Itnavideo creates the draft',
    desc: 'The media engine prepares typography scenes, big captions, audio polish, and a clean mobile layout.',
  },
  {
    number: '04',
    icon: Download,
    title: 'Export for every platform',
    desc: 'Download ready-to-upload MP4s for Reels, TikTok, and Shorts.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#070707] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">How it works</p>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
              Upload audio. Get the short back.
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
            <Clapperboard size={18} className="text-cyan-300" />
            Built for audio-first MVP Shorts
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

