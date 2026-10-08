import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Mic,
  Sparkles,
  Scissors,
  Clock,
  Volume2,
  Waves,
  Radio,
  FileText,
  Sliders,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Audio Cleaner & Studio Master (Up to 15 Mins) | Itnavideo",
  description: "Upload raw audio takes. AI automatically cuts sentence retakes, removes dead pauses, eliminates room echo, and masters vocals to -14 LUFS broadcast standard.",
  alternates: { canonical: "/tools/ai-audio-cleaner" },
  openGraph: {
    title: "AI Audio Cleaner & Broadcast Master – Itnavideo",
    description: "Cuts repeated takes, stumbles, and room noise. Broadcast-grade vocal master in seconds. Free preview.",
  },
};

export default function AIAudioCleanerPage() {
  return (
    <main className="min-h-screen text-[#e6e1e5] bg-[#141218] selection:bg-[#d0bcff] selection:text-[#381e72]">
      {/* ── M3 HERO SECTION ── */}
      <section className="relative overflow-hidden px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        {/* M3 Ambient Glow Layers */}
        <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[600px] rounded-full bg-gradient-to-tr from-[#6750a4]/25 via-[#381e72]/30 to-[#006a60]/20 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* M3 Assist Chip */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d0bcff]/20 bg-[#2b2930]/80 px-4 py-1.5 text-xs font-semibold text-[#eaddff] backdrop-blur-md shadow-sm">
            <Sparkles size={14} className="text-[#d0bcff]" />
            <span>Trained Studio Broadcast Engine • 24-bit WAV Lossless &amp; Vocal EQ</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.12]">
            Raw Voiceover to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#d0bcff] via-[#b69df8] to-[#70efde] bg-clip-text text-transparent">
              Broadcast Studio Master
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#cac4d0]">
            AI listens to your raw recording, surgically cuts stumbles &amp; repeated retakes, tightens dead pauses, removes room echo, shapes tone with Podcast Warmth or Clarity EQ curves, and exports uncompressed 24-bit WAV or MP3 320k.
          </p>

          {/* M3 Filled Button & Secondary Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/dashboard?videoType=audioClean"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#d0bcff] px-8 py-3.5 text-sm font-bold text-[#381e72] shadow-lg shadow-[#d0bcff]/20 transition-all hover:bg-[#eaddff] hover:scale-[1.02] active:scale-95"
            >
              <span>Clean Your Audio Free</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="#benefits"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-[#211f26] px-6 py-3.5 text-sm font-medium text-[#e6e1e5] hover:bg-[#2b2930] transition"
            >
              <Sliders size={15} className="text-[#d0bcff]" />
              <span>See How It Works</span>
            </a>
          </div>

          <p className="mt-4 text-xs text-[#938f99]">
            Instant interactive script preview • Zero software install • 100% cloud processed
          </p>

          {/* Hero Showcase Image */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#211f26] p-2 shadow-2xl">
            <img
              src="/visuals/heroimages/audiocleaner-hero.png"
              alt="AI Audio Cleaner & Studio Master Interface Showcase"
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── M3 COMPACT BENEFITS BENTO (SHORT SPACE, MAXIMUM IMPACT) ── */}
      <section id="benefits" className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d0bcff]">
                Precision Features
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Why Creators Love Our Studio Cleaner
              </h2>
            </div>
            <p className="text-xs text-[#938f99] max-w-xs">
              Every take is polished with our trained acoustic profile in 5 automated passes.
            </p>
          </div>

          {/* Compact 8-card M3 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: Scissors,
                badge: "Auto Retakes Cut",
                badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
                title: "31+ Sentence Retakes Cut",
                desc: "Repeated stumbles and abandoned sentence takes are detected and excised. Keeps your cleanest final delivery.",
              },
              {
                icon: Clock,
                badge: "Trained 0.18s Pacing",
                badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                title: "Dead Pauses Clamped",
                desc: "Awkward gaps (>0.65s) are tightened to a natural 0.18s breathing room. Accelerates flow to a punchy 160 WPM.",
              },
              {
                icon: Waves,
                badge: "24-Bit Lossless",
                badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
                title: "24-Bit Studio WAV & 320k",
                desc: "Download uncompressed 24-bit 48kHz WAV masters for Pro Tools, Premiere & DaVinci, or high-bitrate 320k MP3/M4A.",
              },
              {
                icon: Sliders,
                badge: "Vocal Curves",
                badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
                title: "Podcast Warmth & Clarity EQ",
                desc: "Choose Podcast Warmth for intimate low-end chest tone, Crystal Clarity for modern YouTube punch, or Natural Neutral.",
              },
              {
                icon: Radio,
                badge: "Dynamic Gate",
                badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
                title: "Room Echo & Mud Removal",
                desc: "85Hz highpass cuts mic rumble, 320Hz notch scoops boxy room reverb, and adaptive gates mute background hiss.",
              },
              {
                icon: Volume2,
                badge: "3.2kHz + 8kHz Air",
                badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                title: "Speech Presence & De-Esser",
                desc: "Boosts intelligibility on phone speakers while a dynamic de-esser tames harsh 'S' and 'Sh' sibilance.",
              },
              {
                icon: Waves,
                badge: "EBU R128 Curve",
                badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
                title: "-14 LUFS Broadcast Leveling",
                desc: "Mastered to YouTube and Spotify loudness standards. No sudden quiet whispers or clipping harsh peaks.",
              },
              {
                icon: FileText,
                badge: "Interactive UI",
                badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
                title: "Interactive Script Preview",
                desc: "Read the spoken script before cutting. Strike through any sentence with 1-click or restore accidental cuts.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="group relative flex flex-col justify-between rounded-[20px] border border-white/10 bg-[#1d1b20] p-4 sm:p-5 transition-all hover:border-[#d0bcff]/40 hover:bg-[#211f26] shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b2930] text-[#d0bcff] border border-white/5 group-hover:scale-105 transition-transform">
                      {b?.icon ? <b.icon size={18} /> : <Sparkles size={18} />}
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold font-mono ${b.badgeColor}`}>
                      {b.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{b.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#cac4d0]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── M3 BEFORE VS AFTER SHOWCASE CARD ── */}
      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1d1b20] via-[#211f26] to-[#1a1728] p-6 sm:p-8 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="rounded-full bg-[#381e72]/50 border border-[#d0bcff]/30 px-3 py-1 text-[11px] font-bold text-[#eaddff]">
              Acoustic Comparison
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Hear The Difference
            </h3>
            <p className="text-xs text-[#cac4d0] mt-1">
              Tested on 7-minute real creator takes. 37% time saved, zero robotic artifacts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Box */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-300">🔴 Raw Unedited Take</span>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-mono text-rose-300">07:17</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">✕</span> Room reverb &amp; AC background hum
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">✕</span> 31 stuttered retakes &amp; false starts
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">✕</span> Long dead pauses (118 WPM slow pace)
                </li>
              </ul>
            </div>

            {/* After Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-300">✨ AI Studio Master</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-mono text-emerald-300">04:34</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> -14 LUFS Broadcast EQ &amp; De-Esser
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Cleaned retakes, only best take preserved
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Tight 0.18s pacing (160 WPM broadcast flow)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── M3 HOW IT WORKS (3 STEPS) ── */}
      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-xl sm:text-2xl font-bold text-white">
            How It Works in 3 Steps
          </h2>
          <div className="grid gap-3.5 sm:grid-cols-3">
            {[
              { step: "01", title: "Upload Audio", desc: "Drop MP3, WAV, M4A, or AAC up to 15 minutes. AI starts transcribing immediately." },
              { step: "02", title: "Review & Customize", desc: "View the generated script. Stumbles and awkward pauses are auto-flagged in red." },
              { step: "03", title: "A/B Preview & Export", desc: "Listen with instant Before vs After flip, then download your 256kbps mastered MP3." },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[20px] border border-white/10 bg-[#1d1b20] p-5 transition-all hover:bg-[#211f26]"
              >
                <span className="text-2xl font-black font-mono text-[#d0bcff]/40">{item.step}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#cac4d0]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── M3 FAQ ACCORDION ── */}
      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-xl sm:text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2.5">
            {[
              {
                q: "What is the maximum audio duration allowed?",
                a: "You can upload voiceovers and podcast audio up to 15 minutes (900 seconds) in MP3, WAV, M4A, AAC, or FLAC formats.",
              },
              {
                q: "Does it work if I speak Hindi, Urdu, or Hinglish?",
                a: "Yes! Our speech transcription pipeline has native support for English, Hindi, Urdu, and conversational Hinglish.",
              },
              {
                q: "Will it make my voice sound artificial or robotic?",
                a: "Not at all. Unlike aggressive destructive filters, our engine preserves your natural pitch and resonance while applying gentle multi-band broadcast compression and studio EQ.",
              },
              {
                q: "Can I listen to my original audio before downloading?",
                a: "Yes! The output player features an interactive 'Before vs After' switch with continuous playback so you can audition the contrast in real-time.",
              },
              {
                q: "Can I manually keep a sentence if AI marked it for cutting?",
                a: "Absolutely. In the interactive script preview, simply click any sentence to toggle between 'keep' and 'cut' with full control.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/10 bg-[#1d1b20] p-4 transition-all hover:border-white/20"
              >
                <summary className="cursor-pointer text-sm font-bold text-white list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-[#d0bcff] group-open:rotate-45 transition-transform text-lg ml-2 font-mono">
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-xs leading-relaxed text-[#cac4d0] border-t border-white/5 pt-2.5">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── M3 FINAL CTA SECTION ── */}
      <section className="px-4 pb-24 pt-8 sm:px-6">
        <div className="mx-auto max-w-xl text-center rounded-[28px] border border-[#d0bcff]/20 bg-gradient-to-b from-[#211f26] to-[#141218] p-8 sm:p-10 shadow-2xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d0bcff]/15 text-[#d0bcff]">
            <Mic size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Clean Your Voiceover Now
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#cac4d0]">
            Experience broadcast-level vocal mastering in less than 30 seconds.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard?videoType=audioClean"
              className="inline-flex items-center gap-2 rounded-full bg-[#d0bcff] px-8 py-3.5 text-sm font-bold text-[#381e72] shadow-lg shadow-[#d0bcff]/20 transition-all hover:bg-[#eaddff] hover:scale-105 active:scale-95"
            >
              <span>Open Audio Cleaner</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-[#938f99]">
            Instant cloud processing • No credit card required
          </p>
        </div>
      </section>
    </main>
  );
}
