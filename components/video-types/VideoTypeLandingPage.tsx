import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, ChevronDown, Play, Sparkles } from 'lucide-react';

export type VideoTypeLandingConfig = {
  /** Page identity */
  name: string;
  eyebrow: string;
  tagline: string;          // 1 punchy sentence below h1
  accentColor: string;      // hex, e.g. '#22C55E'
  previewImage: string;     // /preview/... path
  dashboardHref: string;    // ?videoType=...

  /** Stats row — 3 items */
  stats: [string, string][];

  /** How it works — 3 steps */
  steps: { num: string; title: string; body: string }[];

  /** Feature cards — 4–6 items */
  features: { icon: string; title: string; body: string }[];

  /** Audience pills */
  audience: string[];

  /** FAQ */
  faq: { q: string; a: string }[];

  /** CTA button label */
  cta: string;
};

export default function VideoTypeLandingPage({ config }: { config: VideoTypeLandingConfig }) {
  const { name, eyebrow, tagline, accentColor, previewImage, dashboardHref, stats, steps, features, audience, faq, cta } = config;

  return (
    <main className="min-h-screen overflow-x-hidden text-white" style={{ background: '#080C14' }}>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-0 pt-28 sm:px-8 sm:pt-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: `radial-gradient(ellipse 900px 600px at 50% 0%, ${accentColor}22 0%, transparent 60%)`,
        }} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_380px]">

            {/* Left — text */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold"
                style={{ borderColor: `${accentColor}44`, background: `${accentColor}14`, color: accentColor }}>
                <Sparkles size={12} />
                {eyebrow}
              </div>

              <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {name}
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                {tagline}
              </p>

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-6">
                {stats.map(([val, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black" style={{ color: accentColor }}>{val}</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: accentColor, boxShadow: `0 0 28px ${accentColor}55` }}
                >
                  <Play size={15} fill="currentColor" />
                  {cta}
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-sm font-black text-slate-200 transition hover:bg-white/[0.09]"
                >
                  View pricing <ArrowRight size={14} />
                </Link>
              </div>

              <p className="mt-3 text-xs text-slate-500">No credit card needed · First video free · 1080p MP4 export</p>
            </div>

            {/* Right — phone mockup */}
            <div className="mx-auto w-full max-w-[280px] lg:mx-0">
              <div className="relative overflow-hidden rounded-[28px]"
                style={{
                  aspectRatio: '9/16',
                  border: `2px solid ${accentColor}44`,
                  boxShadow: `0 32px 80px rgba(0,0,0,0.55), 0 0 60px ${accentColor}22`,
                  background: '#0f172a',
                }}>
                <Image
                  src={previewImage}
                  alt={`${name} output example`}
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                {/* Phone notch */}
                <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/50" />
                {/* Live badge */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900"
                    style={{ background: accentColor }}>
                    Live output
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080C14] to-transparent" />
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accentColor }}>
            How it works
          </p>
          <h2 className="mb-12 text-center text-2xl font-black text-white sm:text-3xl">
            Three steps from upload to done.
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black"
                  style={{ background: `${accentColor}20`, color: accentColor, border: `1.5px solid ${accentColor}44` }}>
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-black text-white">{step.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-5 py-20 sm:px-8"
        style={{ background: 'linear-gradient(180deg, #080C14 0%, #0a0f1a 100%)' }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accentColor }}>
            What you get
          </p>
          <h2 className="mb-12 text-center text-2xl font-black text-white sm:text-3xl">
            Every output is production-ready.
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}
                className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-5 transition hover:border-white/15">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
                  {f.icon}
                </div>
                <div>
                  <p className="mb-1 text-sm font-black text-white">{f.title}</p>
                  <p className="text-xs leading-5 text-slate-400">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIENCE ────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accentColor }}>
            Who this is for
          </p>
          <h2 className="mb-8 text-2xl font-black text-white">Built for real creators and teams.</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {audience.map((item) => (
              <span key={item}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300">
                <Check size={13} style={{ color: accentColor }} strokeWidth={3} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accentColor }}>
            FAQ
          </p>
          <h2 className="mb-10 text-center text-2xl font-black text-white">Common questions.</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.q}
                className="group rounded-xl border border-white/8 bg-white/[0.025] px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-white">
                  {item.q}
                  <ChevronDown size={16} className="shrink-0 text-slate-500 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="border-t border-white/5 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl p-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 100%)`,
            border: `1px solid ${accentColor}30`,
            boxShadow: `0 0 80px ${accentColor}12`,
          }}>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Start your first {name} now.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            First video is free after signup. No credit card needed. Export a 1080p MP4 in minutes.
          </p>
          <Link
            href={dashboardHref}
            className="mt-7 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
            style={{ background: accentColor, boxShadow: `0 0 28px ${accentColor}55` }}
          >
            <Play size={15} fill="currentColor" />
            {cta}
          </Link>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
            {['No editing skills needed', 'English & Hinglish captions', 'No watermark', '1 free credit on signup'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: accentColor }} strokeWidth={3} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
