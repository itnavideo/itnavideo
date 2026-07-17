"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, Search, Sparkles } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "creator", label: "Creator" },
  { id: "education", label: "Education" },
] as const;

const videoTypes = [
  {
    title: "Auto Caption Video",
    desc: "Professional subtitles for existing reels, with style and position controls.",
    input: "Video",
    category: "creator",
    image: "/preview/Auto Caption Reel.png",
    href: "/auto-caption-reel",
    dashHref: "/dashboard?videoType=auto-caption-reel",
    tags: ["captions", "subtitles", "reels"],
    proof: "Most used",
    accent: "#22C55E",
  },
  {
    title: "Compare Explainer Video",
    desc: "Left vs right comparison videos with images, narration, and a sticker presenter.",
    input: "Audio + 2 images",
    category: "education",
    image: "/preview/Compare Explainer.png",
    href: "/compare-explainer",
    dashHref: "/dashboard?videoType=compare-explainer",
    tags: ["comparison", "vs", "education"],
    proof: "Clear decision format",
    accent: "#F59E0B",
  },
  {
    title: "Whiteboard Video",
    desc: "AI extracts key points from speech and writes them on a professional whiteboard.",
    input: "Audio or Video",
    category: "education",
    image: "/preview/Whiteboard Video.png",
    href: "/whiteboard-video",
    dashHref: "/dashboard?videoType=whiteboard-video",
    tags: ["whiteboard", "education", "points", "notes"],
    proof: "Educational",
    accent: "#10B981",
  },
  {
    title: "Typography Video",
    desc: "Big bold keywords pop on your talking video synced to speech.",
    input: "Video",
    category: "creator",
    image: "/preview/Typography Video.png",
    href: "/typography-video",
    dashHref: "/dashboard?videoType=typography-video",
    tags: ["typography", "bold", "keywords", "text"],
    proof: "Engaging",
    accent: "#8B5CF6",
  },
  {
    title: "Long Video Promo",
    desc: "Turn a long-form video into a short vertical teaser with a watch CTA.",
    input: "Video + thumbnail",
    category: "creator",
    image: "/preview/Long Video Promo.png",
    href: "/long-video-promo",
    dashHref: "/dashboard?videoType=long-video-promo",
    tags: ["youtube", "promo", "thumbnail"],
    proof: "Promo ready",
    accent: "#A3E635",
  },
  {
    title: "Multi Images Video",
    desc: "Video + title + animated image slideshow for news, stories, and visual content.",
    input: "Video + images",
    category: "creator",
    image: "/preview/Multi Images Video.png",
    href: "/multi-images-video",
    dashHref: "/dashboard?videoType=multi-images-video",
    tags: ["images", "slideshow", "news", "story"],
    proof: "Story format",
    accent: "#F472B6",
  },
  {
    title: "Long-form Captioned Video",
    desc: "Preserve a landscape video and original audio with timed captions, up to 10 minutes.",
    input: "Video with speech",
    category: "creator",
    image: "/visuals/previews/long-form-captioned-video.svg",
    href: "/long-form-captioned-video",
    dashHref: "/dashboard?videoType=long-form-captioned-video",
    tags: ["long video", "captions", "youtube", "podcast"],
    proof: "16:9 long-form",
    accent: "#22D3EE",
  },
  {
    title: "Long Video Clips",
    desc: "AI picks best high-energy moments from long videos and renders captioned short clips.",
    input: "Long video",
    category: "creator",
    image: "/preview/Long Video Clips.png",
    href: "/long-video-clips",
    dashHref: "/dashboard?videoType=long-video-clips",
    tags: ["clips", "repurpose", "podcast", "shorts"],
    proof: "Repurpose",
    accent: "#06B6D4",
  },
];

export default function VideoTypesPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = videoTypes;
    if (category !== "all") result = result.filter((videoType) => videoType.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (videoType) =>
          videoType.title.toLowerCase().includes(q) ||
          videoType.desc.toLowerCase().includes(q) ||
          videoType.tags.some((tag) => tag.includes(q)) ||
          videoType.category.includes(q),
      );
    }
    return result;
  }, [category, search]);

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      <section className="relative overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.14),rgba(6,182,212,0.045)_42%,transparent_78%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.07] px-4 py-2 text-xs font-bold text-brand-mint">
            <Sparkles size={13} />
            Live video types
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl md:text-6xl">
                Pick the exact video style you want to create.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Itnavideo now focuses on core video types. No crowded library, no average formats - just the reel styles we can make feel premium and reliable.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
              {[
                [String(videoTypes.length), "Video Types"],
                ["1", "Preview flow"],
                ["9:16", "MP4 output"],
              ].map(([value, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-brand-mint sm:text-3xl">{value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-y border-white/10 bg-[#05070D]/90 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search captions, comparison, promo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-mint/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 rounded-lg border px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                  category === cat.id
                    ? "border-brand-mint/40 bg-brand-mint/15 text-brand-mint"
                    : "border-white/10 bg-white/[0.04] text-slate-500 hover:text-slate-200"
                }`}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {filtered.length} live video types
            </p>
            <Link href="/dashboard" className="hidden items-center gap-1 text-xs font-black uppercase tracking-wide text-brand-mint transition hover:gap-2 sm:inline-flex">
              Create now <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:max-w-6xl xl:mx-auto">
            {filtered.map((videoType, index) => (
              <article
                key={videoType.title}
                className={`group overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-white/20 ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <Link href={videoType.href} className="block">
                  <div className="relative aspect-[9/16] overflow-hidden bg-black">
                    <Image
                      src={videoType.image}
                      alt={`${videoType.title} output preview`}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.035]"
                      priority={index < 2}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <span
                      className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950"
                      style={{ backgroundColor: videoType.accent }}
                    >
                      {videoType.proof}
                    </span>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-lg font-black text-white">{videoType.title}</h2>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">{videoType.input}</p>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="min-h-[3rem] text-sm leading-6 text-slate-400">{videoType.desc}</p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={videoType.dashHref}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-mint px-3 py-2.5 text-xs font-black text-slate-950 transition hover:bg-brand-mint/90"
                    >
                      <Play size={13} fill="currentColor" />
                      Use
                    </Link>
                    <Link
                      href={videoType.href}
                      className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-black text-slate-300 transition hover:border-white/20 hover:text-white"
                      aria-label={`View details for ${videoType.title}`}
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-bold text-slate-500">No video type matches your search.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-4 text-sm font-semibold text-brand-mint hover:underline"
                type="button"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            ["Preview first", "Review the plan and output style before spending the final render credit."],
            ["Focused quality", "The team can improve our video types deeply instead of maintaining many weak formats."],
            ["Clear inputs", "Every video type tells users exactly what to upload and what output to expect."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <CheckCircle2 className="mb-3 text-brand-mint" size={18} />
              <h3 className="text-sm font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
