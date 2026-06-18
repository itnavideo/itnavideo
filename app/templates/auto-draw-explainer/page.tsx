import { ArrowRight, Check, FileText, Mic2, Pencil, Play, Sparkles, Wand2, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auto Draw Explainer — Whiteboard-Style Reels from Voiceover | Itnavideo',
  description: 'Upload audio or video. AI creates whiteboard-style scenes with hand-drawn text, bullets, highlights, and step-by-step visuals synced to your voice.',
  alternates: { canonical: '/templates/auto-draw-explainer' },
  openGraph: {
    title: 'Auto Draw Explainer — Whiteboard Reels in Seconds',
    description: 'Voiceover becomes a whiteboard explainer reel with drawn text and bullet points.',
  },
};

const steps = [
  { icon: Mic2, title: 'Upload voiceover', body: 'Audio or video with clear speech explaining a topic.' },
  { icon: Wand2, title: 'AI builds scenes', body: 'Each sentence becomes a whiteboard scene with title + points.' },
  { icon: Pencil, title: 'Auto-drawn elements', body: 'Text, checkmarks, highlights animate as if being drawn.' },
  { icon: Play, title: 'Download reel', body: '9:16 MP4 whiteboard reel ready for social platforms.' },
];

const features = [
  'Clean white background (whiteboard style)',
  'Bold titles with numbered scenes',
  'Checkmark bullet points that animate in',
  'Colored highlight boxes for key points',
  'Subtitle text synced to voiceover',
  'Scene timestamps visible',
  'Spring physics animations (natural feel)',
  'No images needed — pure text/drawing style',
];

const useCases = [
  '5 Tips / Habits / Steps videos',
  'Educational explainers',
  'Finance & career advice',
  'Course content summaries',
  'Study notes & revision reels',
  'How-to guides & tutorials',
];

export default function AutoDrawExplainerPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 md:pt-36 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(245,158,11,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
            <Pencil size={14} />
            Auto Draw Template
          </span>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Whiteboard Explainers<br />
            <span className="text-amber-600">Drawn from Your Voice</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            Upload a voiceover explaining any topic. AI generates whiteboard-style scenes with hand-drawn text, numbered steps, bullet points, and highlights — all synced to your speech.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard?template=auto-draw" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-sm font-black text-white shadow-lg shadow-amber-500/15 transition hover:bg-amber-600">
              Create Whiteboard Reel <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-4 text-sm font-black text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
              View Pricing
            </Link>
          </div>
          <p className="mt-5 text-xs text-zinc-400">One credit = one reel. Works with any plan.</p>
        </div>
      </section>

      {/* Example preview */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-amber-600">Output Style</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Like a Teacher Drawing on a Whiteboard</h2>
            <p className="mt-3 text-zinc-500">Each scene appears one-by-one, synced to your voiceover timing.</p>
          </div>
          <div className="mt-10 rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-500 text-xl font-black text-blue-600">1</div>
                <h3 className="text-2xl font-black uppercase">WAKE UP EARLY</h3>
              </div>
              <div className="ml-16 space-y-3">
                <div className="flex items-center gap-3"><div className="flex h-6 w-6 items-center justify-center rounded bg-green-500 text-xs text-white font-black">✓</div><span className="text-lg font-bold">More time for yourself</span></div>
                <div className="flex items-center gap-3"><div className="flex h-6 w-6 items-center justify-center rounded bg-green-500 text-xs text-white font-black">✓</div><span className="text-lg font-bold">Better focus</span></div>
                <div className="flex items-center gap-3"><div className="flex h-6 w-6 items-center justify-center rounded bg-green-500 text-xs text-white font-black">✓</div><span className="text-lg font-bold">Positive start of the day</span></div>
              </div>
              <div className="mt-4 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-3">
                <span className="font-black text-red-600">FOCUS → PRODUCTIVITY → DISCIPLINE</span>
              </div>
              <p className="text-center text-sm text-zinc-500 italic">Subah jaldi uthna mental clarity deta hai aur din ki shuruaat productive hoti hai.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-amber-600">Process</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Voice In. Whiteboard Out.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
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
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-amber-600">Features</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">What You Get</h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 text-sm font-bold text-zinc-700">
                <Check size={14} className="shrink-0 text-amber-500" />{f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Perfect For</h2>
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {useCases.map((item) => (
              <div key={item} className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm font-bold text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-10 text-center text-white sm:p-14">
          <Zap className="mx-auto mb-4" size={32} />
          <h2 className="text-3xl font-black sm:text-4xl">Ready to Draw?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-amber-100">
            Upload your voiceover. AI creates the whiteboard scenes. One credit per reel.
          </p>
          <Link href="/dashboard?template=auto-draw" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-amber-700 shadow-xl transition hover:bg-amber-50">
            Create Whiteboard Reel <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
