import { ArrowRight, Check, Film, Image as ImageIcon, Mic2, Play, Sparkles, Wand2, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cinematic Collage — AI Image Story Reel from Voiceover | Itnavideo',
  description: 'Upload audio or video with speech. AI generates cinematic image scenes with Ken Burns motion, text overlays, and transitions. Ready for Reels & Shorts.',
  alternates: { canonical: '/templates/cinematic-collage' },
  openGraph: {
    title: 'Cinematic Collage — AI Image Story Reels',
    description: 'Voiceover + AI = cinematic image-driven reel with motion and typography.',
  },
};

const steps = [
  { icon: Mic2, title: 'Upload voiceover', body: 'Audio or video with clear speech. AI transcribes it.' },
  { icon: Wand2, title: 'AI builds scenes', body: 'Each sentence becomes a cinematic image scene with motion.' },
  { icon: ImageIcon, title: 'Ken Burns motion', body: 'Slow zoom, pan, parallax on every scene image.' },
  { icon: Play, title: 'Download reel', body: '9:16 MP4 with typography, transitions, and audio.' },
];

const features = [
  'Full 9:16 cinematic images per scene',
  'Ken Burns motion (zoom, pan, parallax)',
  'Bold kinetic typography overlays',
  'Scene transitions with timing',
  'RTL language support (Urdu, Arabic, Farsi)',
  'Voiceover stays synced throughout',
  'No manual image uploading needed',
  'AI selects visuals from speech context',
];

const useCases = [
  'Motivational quote reels',
  'Story-driven educational content',
  'Finance explainer slideshows',
  'Travel & lifestyle narration',
  'Podcast clip visuals',
  'News commentary reels',
];

export default function CinematicCollagePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 md:pt-36 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            <Film size={14} />
            Cinematic Collage Template
          </span>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your Voice Becomes a<br />
            <span className="text-violet-600">Cinematic Image Reel</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            Upload audio or video with speech. AI generates cinematic image scenes with Ken Burns motion, bold typography, and smooth transitions — all synced to your voice.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard?template=image-story-collage" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700">
              Create Cinematic Reel <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-4 text-sm font-black text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
              View Pricing
            </Link>
          </div>
          <p className="mt-5 text-xs text-zinc-400">One credit = one reel. Works with any plan.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-violet-600">Process</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Voice In. Cinematic Reel Out.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon size={18} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Step {i + 1}</p>
                  <h3 className="mt-1 text-sm font-black">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-violet-600">Features</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">What You Get</h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
                <Check size={14} className="shrink-0 text-violet-500" />{f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Perfect For</h2>
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {useCases.map((item) => (
              <div key={item} className="rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3 text-sm font-bold text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-purple-700 p-10 text-center text-white sm:p-14">
          <Zap className="mx-auto mb-4" size={32} />
          <h2 className="text-3xl font-black sm:text-4xl">Ready to Create?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-violet-100">
            Upload your voiceover. AI handles the visuals, motion, and layout. One credit per reel.
          </p>
          <Link href="/dashboard?template=image-story-collage" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-violet-700 shadow-xl transition hover:bg-violet-50">
            Create Cinematic Reel <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
