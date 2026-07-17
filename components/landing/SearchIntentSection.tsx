import Link from "next/link";
import { ArrowRight, Captions, CheckCircle2, Clapperboard, Film, Mic2, Search, ShieldCheck, Video } from "lucide-react";

const searchIntents = [
  {
    query: "AI explainer video generator",
    href: "/ai-explainer-video-generator",
    title: "AI explainer video generator",
    body: "Turn audio or video into a clean explainer reel with creator video, subtitles, title, and support visuals.",
    icon: Film,
  },
  {
    query: "Compare explainer video maker",
    href: "/compare-explainer-video-maker",
    title: "Compare two ideas in one reel",
    body: "Create comparison reels with title, two visual panels, subtitles, and a teacher-style explainer layout.",
    icon: Clapperboard,
  },
  {
    query: "Audio to reels generator",
    href: "/audio-to-reels",
    title: "Create reels from voiceover",
    body: "Upload clear speech audio and create a vertical reel with subtitle timing and explainer structure.",
    icon: Mic2,
  },
  {
    query: "Finance reel generator",
    href: "/finance-reel-generator",
    title: "Finance explainers for reels",
    body: "Create finance, banking, salary, career, and exam explainer reels from your source file.",
    icon: Video,
  },
  {
    query: "Hinglish explainer video maker",
    href: "/hinglish-explainer-video-maker",
    title: "Hinglish explainer reels",
    body: "Make English and Roman Hinglish explainer videos for Indian education, finance, and career audiences.",
    icon: Captions,
  },
  {
    query: "Video to reel maker",
    href: "/video-to-reel-maker",
    title: "Repurpose existing videos",
    body: "Keep your original video visible while the reel adds subtitles, title, and a visual explanation area.",
    icon: Clapperboard,
  },
];

const trustItems = [
  "Audio, video, and voiceovers supported",
  "Uploads are private and temporary",
  "One free watermarked Auto Caption trial",
  "Vertical MP4 output for Shorts and Reels",
];

export default function SearchIntentSection() {
  return (
    <section className="px-4 py-16 text-white sm:px-6 md:py-24" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(37, 99, 235, 0.07) 0%, transparent 60%), #0F172A' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
              <Search size={16} />
              Low-competition creator workflows
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl">
              Create reels from the content you already have.
            </h2>
          </div>
          <p className="text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Instead of chasing broad AI video keywords, Itnavideo is built around specific creator use cases: audio to reels, finance explainers, Hinglish explainers, faceless videos, and video-to-reel workflows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {searchIntents.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.query} href={item.href} className="rounded-lg border border-white/10 bg-zinc-950 p-5 transition hover:border-brand-mint/35">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className="rounded-md border border-brand-mint/20 bg-brand-mint/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-mint">
                    {item.query}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/[0.055] text-zinc-200">
                    <Icon size={19} />
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.body}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 rounded-lg border border-white/10 bg-zinc-950 p-5 md:grid-cols-[0.75fr_1.25fr] md:p-7">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-mint">Trust basics</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">Simple enough to try today.</h2>
            <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-black text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
              Start creating
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustItems.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/25 p-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                  {index === 1 ? <ShieldCheck size={16} /> : <CheckCircle2 size={16} />}
                </span>
                <p className="text-sm font-bold leading-6 text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
