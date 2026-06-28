import React from 'react';
import { Captions, Download, LayoutTemplate, Sparkles, Upload } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: LayoutTemplate,
    title: 'Pick a template',
    desc: 'Choose one of six focused templates: creator edits, background replace, captions, comparisons, whiteboard explainers, or promos.',
  },
  {
    number: '02',
    icon: Upload,
    title: 'Upload your content',
    desc: 'Video, audio, or images. The upload area adapts to your chosen template.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'AI transcribes & plans',
    desc: 'Speech becomes timed subtitles. AI builds the layout, captions, and visuals.',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download your reel',
    desc: 'Get a 9:16 MP4 ready for Instagram Reels, YouTube Shorts, and TikTok.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24" style={{ background: 'var(--bg-light)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--color-primary)' }}>How it works</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl" style={{ color: 'var(--text-light-primary)' }}>
              Upload once. Get a reel back.
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm" style={{ border: '0.5px solid var(--border-light)', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            <Captions size={18} style={{ color: 'var(--color-primary)' }} />
            One payment unlocks all templates
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="p-6" style={{ background: 'var(--bg-white)', border: '0.5px solid var(--border-light)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow-light)' }}>
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold" style={{ color: 'var(--text-light-muted)' }}>{step.number}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-light-primary)' }}>{step.title}</h3>
                <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-light-secondary)' }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
