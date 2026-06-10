import Link from "next/link";
import { ArrowRight, Captions, CheckCircle2, Clapperboard, Film, Mic2, Search, ShieldCheck, Video } from "lucide-react";

const searchIntents = [
  {
    query: "AI reel generator",
    href: "/ai-reel-generator",
    title: "AI reel generator for creators",
    body: "Turn a short idea, video, or voiceover into a mobile-first reel without opening a complex editor.",
    icon: Film,
  },
  {
    query: "YouTube Shorts generator",
    href: "/youtube-shorts-generator",
    title: "Create Shorts from one source file",
    body: "Upload a video or voiceover and generate a vertical MP4 designed for Shorts, Reels, and social feeds.",
    icon: Video,
  },
  {
    query: "script to video",
    href: "/script-to-video",
    title: "Turn scripts into short videos",
    body: "Use a script or voiceover to plan title text, scene timing, captions, and a clean vertical video structure.",
    icon: Mic2,
  },
  {
    query: "video to reel",
    href: "/video-to-reel-maker",
    title: "Repurpose existing videos",
    body: "Keep the original video visible while AI creates short-form title, text, timing, and export structure.",
    icon: Clapperboard,
  },
  {
    query: "faceless video generator",
    href: "/faceless-video-generator",
    title: "Create faceless explainer videos",
    body: "Use voiceover, smart subtitles, and scene visuals when you want to publish without showing your face.",
    icon: Captions,
  },
  {
    query: "AI captions/subtitles",
    href: "/ai-subtitle-generator",
    title: "Subtitles inside explainers",
    body: "The Explainer Video template uses transcript timing for readable subtitles and active word emphasis.",
    icon: Captions,
  },
];

const trustItems = [
  'Audio, video, and voiceovers supported',
  'Uploads are private and temporary',
  'First video test starts at ₹9',
  'Vertical MP4 output for Shorts and Reels',
];

export default function SearchIntentSection() {
  return (
    <section className="bg-[#050506] px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
              <Search size={16} />
              Creator workflows
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl">
              Create reels from the content you already have.
            </h2>
          </div>
          <p className="text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Itnavideo is built for creators, educators, and businesses who already have a clip, voice note, image, or idea and need a clean short-form output quickly.
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
            <Link href="/create" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-mint px-5 py-3 text-sm font-black text-black transition hover:bg-white">
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
