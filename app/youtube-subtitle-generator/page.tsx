import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Captions,
  Check,
  Clock3,
  Film,
  Laptop,
  MonitorPlay,
  Shield,
  Sparkles,
  Upload,
  Volume2,
  Wand2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo",
  description:
    "Add clean, professional subtitles to your YouTube videos and podcasts up to 15 minutes. 5 real creator styles, 100% original video & audio fidelity.",
  alternates: { canonical: "/youtube-subtitle-generator" },
  openGraph: {
    title: "YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo",
    description:
      "Keep your full 16:9 video and original audio. Add creator-approved subtitles. Up to 15 minutes, 1920×1080 MP4.",
    images: ["/visuals/heroimages/youtubesubtitlesgenerator.hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Subtitle Generator | Itnavideo",
    description:
      "Professional subtitles for YouTube videos and podcasts. 5 real creator styles. Up to 15 minutes.",
    images: ["/visuals/heroimages/youtubesubtitlesgenerator.hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Itnavideo YouTube Subtitle Generator",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: "https://www.itnavideo.com/youtube-subtitle-generator",
  description:
    "Upload a 16:9 YouTube video and receive a full-length 1080p MP4 with professional creator-styled subtitles. Original video and audio preserved. Supports up to 15 minutes.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "9",
    highPrice: "90",
    offerCount: "10",
  },
  screenshot: "https://www.itnavideo.com/visuals/heroimages/youtubesubtitlesgenerator.hero.png",
};

const creatorStyles = [
  {
    name: "Minimal Clean",
    creator: "Ali Abdaal • Veritasium",
    font: "Inter Sans",
    desc: "Modern, distraction-free lower-third subtitles with subtle translucent backing. Ideal for tutorials and essays.",
    tag: "Clean & Modern",
  },
  {
    name: "Cinematic Docu",
    creator: "Vox • Johnny Harris • Magnates Media",
    font: "Montserrat Bold",
    desc: "Editorial documentary typography with crisp yellow key-phrase highlights and letterbox safety.",
    tag: "Documentary",
  },
  {
    name: "Studio Podcast",
    creator: "Huberman Lab • Diary of a CEO • Rogan",
    font: "Poppins Bold",
    desc: "High-contrast white text on matte black rounded box. 100% readability across mobile and desktop screens.",
    tag: "Podcasts & Interviews",
  },
  {
    name: "Bold Creator",
    creator: "MKBHD • Tech & Gaming YouTubers",
    font: "Montserrat ExtraBold",
    desc: "High-energy bold subtitles with crisp black border outline and vibrant yellow accents.",
    tag: "High Energy",
  },
  {
    name: "Netflix Classic",
    creator: "Streaming Docu & Cinema Standard",
    font: "Roboto Condensed",
    desc: "Broadcast-grade yellow cinema subtitles with drop shadow. The timeless streaming film look.",
    tag: "Cinema Broadcast",
  },
];

const steps = [
  {
    icon: Upload,
    title: "1. Upload your 16:9 video",
    desc: "MP4, MOV, or WEBM up to 15 minutes. Supports podcasts, tutorials, vlogs, and explainers.",
  },
  {
    icon: Wand2,
    title: "2. Choose creator style",
    desc: "Select from 5 proven creator styles: Minimal Clean, Cinematic Docu, Studio Podcast, Bold Creator, or Netflix Classic.",
  },
  {
    icon: Film,
    title: "3. Download 1080p MP4",
    desc: "Full 1920×1080 landscape video with your original audio and perfectly timed subtitles baked in.",
  },
];

const features = [
  {
    icon: Clock3,
    title: "Up to 15 minutes duration",
    desc: "Full podcast episodes, in-depth tutorials, product breakdowns — no artificial 60-second limit.",
  },
  {
    icon: Volume2,
    title: "100% Original audio & video quality",
    desc: "Zero re-compression distortion, no unwanted AI voices or stock BGM. Your voice and video stay pristine.",
  },
  {
    icon: Captions,
    title: "Word-level Speech AI sync",
    desc: "State-of-the-art Speech AI transcription aligns words down to the millisecond with zero latency drift.",
  },
  {
    icon: MonitorPlay,
    title: "Native 1920×1080 Widescreen",
    desc: "No forced vertical cropping or letterboxing black bars. Rendered in full crisp 1080p landscape for YouTube.",
  },
  {
    icon: Laptop,
    title: "5 Curated real creator styles",
    desc: "No random gimmicks. Only styles proven by top YouTubers and major streaming platforms.",
  },
  {
    icon: Shield,
    title: "Private & auto-deleted",
    desc: "Encrypted in transit, processed on isolated render nodes, and auto-deleted after 48 hours.",
  },
];

const faqs = [
  {
    q: "How does YouTube Subtitle Generator differ from Auto Caption Generator?",
    a: "Auto Caption Generator is designed for 9:16 vertical shorts and reels with bouncy kinetic animations. YouTube Subtitle Generator is designed specifically for 16:9 landscape YouTube videos up to 15 minutes with clean, professional creator subtitle layouts.",
  },
  {
    q: "What is the maximum video length supported?",
    a: "You can upload videos up to 15 minutes (900 seconds) in length. Longer files can be trimmed to 15 minutes or split into parts.",
  },
  {
    q: "Does this change or degrade my original video and audio?",
    a: "No. Your original video resolution and audio balance remain 100% intact. We pass your audio directly through without adding voiceovers, SFX, or loud background music.",
  },
  {
    q: "How does the credit pricing work?",
    a: "Billing is 1 credit for every 2 minutes of video length (e.g., a 2-minute video costs 1 credit; a 10-minute video costs 5 credits; a 15-minute video costs 8 credits). If any render fails, credits are automatically refunded.",
  },
  {
    q: "Can I customize subtitle font size and positioning?",
    a: "Yes! In the studio, you can adjust vertical placement (bottom or top) and font sizes (small, medium, large) to fit your video's framing perfectly.",
  },
];

export default function YouTubeSubtitleGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,109,0,0.15),rgba(255,255,255,0))]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-2 text-xs font-bold text-[#FF9100]">
            <Sparkles size={14} className="text-[#FF9100]" />
            16:9 Landscape • Up to 15 Minutes
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl">
            YouTube Subtitle Generator
            <br />
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              Clean, Creator-Grade Subtitles
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Stop doing manual SRT captions. Upload your 16:9 YouTube video, podcast, or tutorial.
            Apply real creator subtitle styles with word-precise AI sync in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=youtube-subtitle-generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
            >
              Generate YouTube Subtitles Now
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#151E30] px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              View Pricing (1 Credit / 2 Min)
            </Link>
          </div>

          {/* Quick proof badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> Up to 15 Min Videos
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> 100% Original Audio & Video Intact
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> 5 Real Creator Styles
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> 1920×1080 Landscape MP4
            </span>
          </div>
        </div>
      </section>

      {/* ── 5 Real Creator Styles Showcase ── */}
      <section className="relative border-t border-white/10 bg-[#0E1526]/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="rounded-full bg-[#FF6D00]/10 border border-[#FF6D00]/20 px-3 py-1 text-xs font-bold text-[#FF9100]">
              Curated Subtitle Presets
            </span>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Styles Actually Used by Top Creators
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
              No distracting cartoon gimmicks. We hand-tuned typography, outlines, and highlight
              tones matching the highest-performing channels on YouTube.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creatorStyles.map((style) => (
              <div
                key={style.name}
                className="group relative rounded-2xl border border-white/10 bg-[#0E1526] p-6 transition hover:border-[#FF6D00]/50 hover:shadow-lg hover:shadow-[#FF6D00]/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9100] bg-[#FF6D00]/10 rounded-md px-2 py-0.5">
                    {style.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{style.font}</span>
                </div>
                <h3 className="mt-4 text-xl font-black text-white group-hover:text-[#FFA726] transition">
                  {style.name}
                </h3>
                <p className="mt-1 text-xs font-bold text-slate-400">{style.creator}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Step Process ── */}
      <section className="border-t border-white/10 bg-[#070B14] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">How It Works</h2>
            <p className="mt-2 text-sm text-slate-400">3 simple steps to studio-ready YouTube subtitles</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => {
              const Icon = s?.icon || Sparkles;
              return (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-[#0E1526]/50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="border-t border-white/10 bg-[#0E1526]/40 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Built for Real YouTube Workflows</h2>
            <p className="mt-2 text-sm text-slate-400">Engineered for long-form podcasts, webinars, tutorials, and video essays.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f?.icon || Sparkles;
              return (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-[#0E1526] p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6D00]/10 text-[#FF9100]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="border-t border-white/10 bg-[#070B14] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/10 bg-[#0E1526]/40 p-5">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0E1526] to-[#070B14] px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Upgrade Your YouTube Videos Today
          </h2>
          <p className="mt-4 text-sm text-slate-300">
            Generate clean, real-creator subtitles for videos up to 15 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard?videoType=youtube-subtitle-generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-4 text-sm font-bold text-black shadow-xl shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
            >
              Start Generating Subtitles
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
