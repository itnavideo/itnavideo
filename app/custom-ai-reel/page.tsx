import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom AI Reel Generator | Create Reels From Your Instructions",
  description:
    "Create custom AI reels by describing what you want. Upload videos, images, screenshots, audio, or logos and let Itnavideo generate a 9:16 reel automatically.",
  openGraph: {
    title: "Custom AI Reel Generator | Itnavideo",
    description:
      "Describe your video, upload your media, and let Itnavideo create a custom 9:16 reel for you.",
    type: "website",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Describe your video",
    body: "Type what you want in plain English. Mention timings, text, images, and style. No technical knowledge needed.",
  },
  {
    step: "2",
    title: "Upload your media",
    body: "Add video clips, images, screenshots, a voiceover, or your logo. Everything is optional — text-only reels work too.",
  },
  {
    step: "3",
    title: "Get your reel",
    body: "Itnavideo builds a structured timeline from your instructions and renders a polished 9:16 reel in minutes.",
  },
];

const BEFORE_AFTER = [
  {
    before: "Static image",
    after: "Motion reel with text overlay and slow zoom",
    icon: "🖼️",
  },
  {
    before: "No strong opening",
    after: 'Big bold intro text that grabs attention in 2 seconds',
    icon: "✏️",
  },
  {
    before: "Plain website screenshot",
    after: "Zoomed, framed website showcase scene",
    icon: "🖥️",
  },
  {
    before: "Multiple static images",
    after: "Smooth image reel with per-scene motion",
    icon: "📸",
  },
  {
    before: "Raw video clip",
    after: "Custom reel layout with caption text and motion",
    icon: "🎬",
  },
];

const WHAT_YOU_CAN_ASK = [
  'Start with big bold text: "Create Better Videos Faster"',
  "From 5 to 15 seconds, show my uploaded website screenshot",
  "From 15 to 30 seconds, show my video clip",
  "Add a voiceover and generate subtitles automatically",
  "At the end, show my logo and website URL",
  "Keep text minimal and let the images speak",
];

const UPLOAD_OPTIONS = [
  { label: "Video clips", desc: "MP4, MOV, WEBM", icon: "🎬" },
  { label: "Images & screenshots", desc: "JPG, PNG, WEBP — up to 8", icon: "🖼️" },
  { label: "Voiceover / audio", desc: "MP3, WAV, M4A, AAC", icon: "🎙️" },
  { label: "Logo", desc: "PNG or JPG for end screen", icon: "✅" },
  { label: "Text only", desc: "No upload needed at all", icon: "✍️" },
];

const FAQ = [
  {
    q: "Do I need to upload any media?",
    a: "No. You can describe a text-only reel and Itnavideo will build it from your instructions. Media uploads are optional.",
  },
  {
    q: "What languages does the prompt support?",
    a: "The prompt should be in simple English for best results. Grammar mistakes and short phrases are accepted.",
  },
  {
    q: "Can I specify exact timing for each scene?",
    a: 'Yes. Write timings like "From 5 to 15 seconds, show my screenshot" and the planner will follow them.',
  },
  {
    q: "How long can the reel be?",
    a: "Up to 60 seconds. If you upload audio or video, the reel duration follows that, capped at 60 seconds.",
  },
  {
    q: "Will subtitles be added automatically?",
    a: "If you upload audio or video and enable subtitles, Itnavideo transcribes speech and adds auto-captions.",
  },
  {
    q: "Can I add a logo or branding?",
    a: "Yes. Upload your logo PNG and mention it in the prompt. It will appear on the end screen.",
  },
];

export default function CustomAiReelPage() {
  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-28 text-center md:pt-36">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300">
          Custom AI Reel
        </div>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Create Custom AI Reels<br />
          <span className="text-sky-400">From Your Instructions</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Describe your video, upload your media, and let Itnavideo create a custom 9:16 reel for you. No editing skills required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard?videoType=custom-ai-reel"
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-7 py-3.5 text-sm font-black text-white transition hover:bg-sky-400"
          >
            Create Custom AI Reel →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-bold text-zinc-300 transition hover:bg-white/[0.08]"
          >
            View Pricing
          </Link>
        </div>
        {/* Mock 9:16 preview frame */}
        <div className="mx-auto mt-14 w-52 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#102033] to-[#0f172a] shadow-2xl" style={{ aspectRatio: "9/16" }}>
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-300">
              Custom AI
            </div>
            <p className="text-lg font-black leading-tight text-white">Create Better Videos Faster</p>
            <div className="h-px w-full bg-white/10" />
            <p className="text-xs leading-relaxed text-zinc-400">Your prompt. Your media. Your reel.</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-sky-400 to-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-white/[0.015]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="mb-10 text-center text-2xl font-black text-white sm:text-3xl">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-lg font-black text-sky-400">
                  {item.step}
                </div>
                <h3 className="mb-2 text-base font-black text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After ───────────────────────────────────────── */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="mb-3 text-center text-2xl font-black text-white sm:text-3xl">Before → After</h2>
          <p className="mb-10 text-center text-sm text-zinc-500">What Custom AI Reel turns your uploads into</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BEFORE_AFTER.map((item) => (
              <div key={item.before} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <div className="mb-2 rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-xs font-bold text-zinc-400">
                  Before: {item.before}
                </div>
                <div className="rounded-lg border border-sky-400/25 bg-sky-400/[0.07] px-3 py-2 text-xs font-bold text-sky-300">
                  After: {item.after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What users can ask ───────────────────────────────────── */}
      <section className="border-t border-white/8 bg-white/[0.015]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="mb-3 text-center text-2xl font-black text-white sm:text-3xl">What you can ask for</h2>
          <p className="mb-10 text-center text-sm text-zinc-500">Plain English instructions — describe your video like you&apos;re telling a friend</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {WHAT_YOU_CAN_ASK.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="mt-0.5 text-sky-400">→</span>
                <p className="text-sm leading-relaxed text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upload options ───────────────────────────────────────── */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="mb-3 text-center text-2xl font-black text-white sm:text-3xl">Upload options</h2>
          <p className="mb-10 text-center text-sm text-zinc-500">All optional. Combine freely or go text-only.</p>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {UPLOAD_OPTIONS.map((opt) => (
              <div key={opt.label} className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <span className="mb-3 text-3xl">{opt.icon}</span>
                <p className="text-sm font-black text-white">{opt.label}</p>
                <p className="mt-1 text-[11px] text-zinc-500">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-white/[0.015]">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <h2 className="mb-10 text-center text-2xl font-black text-white sm:text-3xl">FAQ</h2>
          <div className="grid gap-5">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="mb-2 text-sm font-black text-white">{item.q}</p>
                <p className="text-sm leading-relaxed text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl">Ready to build your reel?</h2>
          <p className="mb-8 text-base text-zinc-400">
            Describe your video, upload your media, and get a polished 9:16 Custom AI Reel.
          </p>
          <Link
            href="/dashboard?videoType=custom-ai-reel"
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-8 py-4 text-base font-black text-white transition hover:bg-sky-400"
          >
            Create Custom AI Reel →
          </Link>
          <p className="mt-4 text-xs text-zinc-600">No editing skills required. First video from ₹9.</p>
        </div>
      </section>
    </main>
  );
}
