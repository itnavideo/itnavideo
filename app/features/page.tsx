import { ArrowRight, Captions, Check, Film, Layers3, Palette, Sparkles, Upload, Wand2, X, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Features — AI Reel Workflow | Itnavideo",
  description: "A focused AI reel workflow. Upload content, AI handles captions, scenes, layouts, and export. Not a random generator.",
  alternates: { canonical: "/features" },
};

const features = [
  { title: "Video Type-first workflow", desc: "Choose a focused video type. Each one has a clear input and output - no blank timelines.", icon: Layers3 },
  { title: "Real transcript timing", desc: "Captions and scenes follow your actual spoken words with word-level sync.", icon: Captions },
  { title: "Focused video types", desc: "Creator edits, background replace, captions, comparisons, whiteboard explainers, and long video promos.", icon: Film },
  { title: "AI scene planning", desc: "Gemini/AI analyzes your content and creates visual scenes automatically.", icon: Wand2 },
  { title: "Clean visual system", desc: "Fonts, spacing, motion, and safe zones stay consistent across every reel.", icon: Palette },
  { title: "Fast cloud rendering", desc: "2-3 minute render on AWS Lambda. No local processing or heavy software needed.", icon: Zap },
];

const handles = [
  "Captions synced to speech",
  "Scene planning from transcript",
  "Dynamic typography and highlights",
  "Visual layout and safe zones",
  "Video type-specific design",
  "Background music selection",
  "Progress bar and CTA overlays",
  "1080×1920 MP4 export",
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.06] px-4 py-2 text-xs font-bold text-brand-mint">
            <Sparkles size={13} />
            Product Features
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            A focused AI reel workflow,<br />
            <span className="text-zinc-400">not a random generator.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Upload video or audio. AI transcribes, plans scenes, adds captions, and renders a polished 9:16 reel. You direct — AI edits.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-brand-mint px-8 py-4 text-base font-black text-black transition hover:bg-white">
              Create Free AI Video <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/40 px-7 py-4 text-sm font-bold text-zinc-300 transition hover:text-white">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y border-white/8 bg-zinc-950/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Core Features</p>
          <h2 className="mb-10 text-3xl font-black sm:text-4xl">The practical controls creators expect.</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-white/20 hover:bg-zinc-900/70">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-mint/10 text-brand-mint">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-black text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Simple Workflow</p>
          <h2 className="mb-12 text-center text-3xl font-black sm:text-4xl">Upload once. Get a reel back.</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", title: "Choose a Video Type", desc: "Focused video types for captions, explainers, comparisons, whiteboard, typography, and promos.", icon: Layers3 },
              { num: "02", title: "Upload content", desc: "Video, audio, or images. Upload area adapts to your selected video type.", icon: Upload },
              { num: "03", title: "AI plans & renders", desc: "Speech becomes captions. AI builds layout, visuals, and exports.", icon: Wand2 },
              { num: "04", title: "Download your reel", desc: "9:16 MP4 ready for Instagram Reels, YouTube Shorts, TikTok.", icon: Film },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="rounded-xl border border-white/8 bg-zinc-900/30 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-black text-brand-mint">{step.num}</span>
                    <Icon size={20} className="text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-black">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Itnavideo Handles */}
      <section className="border-y border-white/8 bg-zinc-950/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Handled For You</p>
          <h2 className="mb-10 text-center text-3xl font-black sm:text-4xl">What Itnavideo handles automatically</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {handles.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/8 bg-zinc-900/30 px-5 py-4">
                <Check size={16} className="shrink-0 text-brand-mint" />
                <span className="text-sm font-bold text-zinc-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-rose-300">The Problem</p>
          <h2 className="mb-4 text-3xl font-black sm:text-4xl">Creators have ideas. Editing steals the schedule.</h2>
          <p className="mb-10 max-w-2xl text-base text-zinc-400">Itnavideo removes the blank-page problem. Transcript, scene plan, captions, and render are handled before you open an editor.</p>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-zinc-900/50">
                  <th className="px-5 py-4 text-left font-bold text-zinc-400">Workflow</th>
                  <th className="px-5 py-4 text-center font-bold text-rose-300">Manual Editing</th>
                  <th className="px-5 py-4 text-center font-bold text-brand-mint">Itnavideo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Editing time", "4-6 hours per reel", "2-3 minutes"],
                  ["Captions", "Manual timing + keyframes", "Auto-synced from speech"],
                  ["Visual planning", "Search clips, rebuild layouts", "AI plans scenes from script"],
                  ["Learning curve", "Learn Premiere/CapCut/DaVinci", "Upload + click Generate"],
                  ["Cost", "Editor salary or $50+/mo tools", "Pro plan, billed monthly"],
                  ["Consistency", "Different every time", "Same quality every reel"],
                ].map(([feature, manual, ai]) => (
                  <tr key={feature} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 font-bold text-zinc-200">{feature}</td>
                    <td className="px-5 py-3.5 text-center text-zinc-500"><span className="inline-flex items-center gap-1.5"><X size={13} className="text-rose-400" />{manual}</span></td>
                    <td className="px-5 py-3.5 text-center text-zinc-200"><span className="inline-flex items-center gap-1.5"><Check size={13} className="text-brand-mint" />{ai}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Output Preview */}
      <section className="border-t border-white/8 bg-zinc-950/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Output Quality</p>
          <h2 className="mb-10 text-3xl font-black sm:text-4xl">See what gets exported</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {[
              { image: '/preview/Dynamic Creator Reel.png', label: 'Dynamic Edit' },
              { image: '/preview/Auto Caption Reel.png', label: 'Auto Captions' },
              { image: '/preview/Compare Explainer.png', label: 'Compare' },
              { image: '/preview/Auto Draw Explainer.png', label: 'Auto Draw' },
            ].map((ex) => (
              <div key={ex.label} className="relative overflow-hidden rounded-xl border border-white/8">
                <div className="relative aspect-[9/16]">
                  <Image src={ex.image} alt={ex.label} fill sizes="200px" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-xs font-black text-white">{ex.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Ready to stop editing and start directing?</h2>
          <p className="mt-4 text-base text-zinc-400">Upload your content and get a ready-to-post reel back. No timeline, no plugins, no learning curve.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-brand-mint px-8 py-4 text-base font-black text-black transition hover:bg-white">
              Create Free AI Video <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 px-7 py-4 text-sm font-bold text-zinc-300 transition hover:text-white">
              View Video Types
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}
