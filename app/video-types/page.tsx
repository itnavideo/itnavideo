"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Eye,
  Film,
  Layers,
  LucideIcon,
  Play,
  Search,
  Sliders,
  Sparkles,
  Tv,
  Wand2,
  X,
  Zap,
} from "lucide-react";

type VideoTypeItem = {
  id: string;
  title: string;
  desc: string;
  aspectRatio: "9:16" | "16:9" | "Audio";
  input: string;
  output: string;
  renderTime: string;
  credits: number;
  category: "reels" | "longform" | "tools";
  image: string;
  href: string;
  dashHref: string;
  tags: string[];
  proof: string;
  accent: string;
  workflowSteps: [string, string, string];
};

const ALL_VIDEO_TYPES: VideoTypeItem[] = [
  {
    id: "auto-caption-generator",
    title: "Auto Caption Generator",
    desc: "AI auto caption generator for Instagram Reels and videos. Word-by-word animated subtitles synced to speech with custom positions, colors, and fonts.",
    aspectRatio: "9:16",
    input: "Video / Audio",
    output: "Captioned Reel / Video",
    renderTime: "~20s",
    credits: 1,
    category: "reels",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png",
    href: "/auto-captions",
    dashHref: "/dashboard?videoType=auto-caption-generator",
    tags: ["auto caption generator", "captions for instagram", "subtitles", "ai captions", "viral"],
    proof: "100k+ High Search Volume",
    accent: "#3B82F6",
    workflowSteps: [
      "Upload video or voice clip",
      "AI transcribes speech and detects timestamps",
      "Renders animated captions with custom layout",
    ],
  },
  {
    id: "compare-explainer",
    title: "Compare Explainer Video",
    desc: "Side-by-side concept comparison reel featuring animated sticker presenter, dual images, and synced narration.",
    aspectRatio: "9:16",
    input: "Audio track + 2 images",
    output: "Side-by-side comparison reel",
    renderTime: "~30s",
    credits: 1,
    category: "reels",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788093814/teacher-welcome_ouesss.png",
    href: "/compare-explainer",
    dashHref: "/dashboard?videoType=compare-explainer",
    tags: ["comparison", "vs", "education", "explainer", "products"],
    proof: "Clear Decision Format",
    accent: "#F59E0B",
    workflowSteps: [
      "Upload audio or record narration",
      "Upload Left vs Right subject images",
      "Render dual-column comparison with animated presenter",
    ],
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard Explainer",
    desc: "Extracts key bullet points from speech and writes them onto a sleek digital whiteboard with animated visuals.",
    aspectRatio: "9:16",
    input: "Audio or Video file",
    output: "Interactive whiteboard reel",
    renderTime: "~35s",
    credits: 1,
    category: "reels",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png",
    href: "/whiteboard-video",
    dashHref: "/dashboard?videoType=whiteboard-video",
    tags: ["whiteboard", "education", "notes", "summary", "teaching"],
    proof: "High Engagement",
    accent: "#10B981",
  workflowSteps: [
      "Upload speech or video lesson",
      "AI extracts structured key takeaways",
      "Renders dynamic whiteboard animation with captions",
    ],
  },
  {
    id: "typography-video",
    title: "Typography Video",
    desc: "Big, bold, high-energy kinetic text overlays popping to speech beats for max viewer retention.",
    aspectRatio: "9:16",
    input: "Video file",
    output: "Kinetic typography reel",
    renderTime: "~20s",
    credits: 1,
    category: "reels",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png",
    href: "/typography-video",
    dashHref: "/dashboard?videoType=typography-video",
    tags: ["typography", "bold", "text", "viral", "energy"],
    proof: "Viral Style",
    accent: "#8B5CF6",
    workflowSteps: [
      "Upload talking video file",
      "System isolates speech beats & emphasis keywords",
      "Renders bold animated typography overlays",
    ],
  },
  {
    id: "long-video-promo",
    title: "Long Video Promo",
    desc: "Converts long YouTube videos or podcasts into high-converting vertical trailer teasers with thumbnail callouts.",
    aspectRatio: "9:16",
    input: "Video + YouTube Thumbnail",
    output: "Vertical teaser trailer with CTA",
    renderTime: "~30s",
    credits: 1,
    category: "reels",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png",
    href: "/long-video-promo",
    dashHref: "/dashboard?videoType=long-video-promo",
    tags: ["youtube", "promo", "podcast", "teaser", "shorts"],
    proof: "YouTube Growth",
    accent: "#EC4899",
    workflowSteps: [
      "Upload long video snippet + thumbnail",
      "Adds animated headline title & watch CTA",
      "Exports high-converting trailer for Reels & Shorts",
    ],
  },
  {
    id: "multi-images-video",
    title: "Multi Images Video",
    desc: "Combines video clips, title headlines, and animated photo slideshows for news, storytelling, and case studies.",
    aspectRatio: "9:16",
    input: "Video + multiple image URLs",
    output: "Multi-slide news & story reel",
    renderTime: "~35s",
    credits: 1,
    category: "reels",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788202087/file_00000000ce648211b220fc406885b264_k6snxz.png",
    href: "/multi-images-video",
    dashHref: "/dashboard?videoType=multi-images-video",
    tags: ["news", "story", "slideshow", "photos", "case study"],
    proof: "Storytelling Format",
    accent: "#06B6D4",
    workflowSteps: [
      "Upload voiceover video + photo gallery",
      "AI arranges transition timing & headline badges",
      "Renders magazine-style news reel",
    ],
  },
  {
    id: "long-video-clips",
    title: "Long Video Clips",
    desc: "AI identifies highest-energy viral moments from long videos and auto-cuts captioned vertical clips.",
    aspectRatio: "9:16",
    input: "Long video file or URL",
    output: "Multiple captioned short clips",
    renderTime: "~40s",
    credits: 1,
    category: "longform",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png",
    href: "/long-video-clips",
    dashHref: "/dashboard?videoType=long-video-clips",
    tags: ["clips", "repurpose", "podcast", "highlights", "viral"],
    proof: "Repurpose Tool",
    accent: "#10B981",
    workflowSteps: [
      "Provide long video source file",
      "AI detects highlight hooks and cuts key moments",
      "Renders captioned vertical clip reel",
    ],
  },
  {
    id: "faceless-video",
    title: "Faceless Video",
    desc: "Turn voiceover audio up to 20 minutes into complete 16:9 widescreen YouTube videos with curated AI visuals, Canva backgrounds & synced captions.",
    aspectRatio: "16:9",
    input: "Voiceover (Up to 20 Min)",
    output: "16:9 Widescreen Video",
    renderTime: "~60s",
    credits: 3,
    category: "longform",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png",
    href: "/faceless-video",
    dashHref: "/dashboard?videoType=faceless-video",
    tags: ["ai video generator", "text to video", "youtube long video", "b-roll", "subtitles"],
    proof: "100K-1M Search Volume",
    accent: "#38BDF8",
    workflowSteps: [
      "Upload audio voiceover, video, or script",
      "AI detects timestamps, matches B-roll & background music",
      "Exports complete 1080p full-length video",
    ],
  },
  {
    id: "ai-audio-cleaner",
    title: "AI Audio Cleaner",
    desc: "Upload long audio recordings. AI displays the full script in the preview dashboard, removes recording mistakes, repeated takes & awkward silences for polished studio-ready sound.",
    aspectRatio: "16:9",
    input: "Long Audio (MP3, WAV, M4A)",
    output: "Cleaned Studio Audio + Full Script",
    renderTime: "~15s",
    credits: 1,
    category: "longform",
    image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png",
    href: "/tools/ai-audio-cleaner",
    dashHref: "/dashboard?videoType=ai-audio-cleaner",
    tags: ["audio", "clean", "podcast", "voiceover", "silence removal", "script"],
    proof: "Studio Audio",
    accent: "#EAB308",
    workflowSteps: [
      "Upload long voiceover or podcast audio recording",
      "AI displays full script preview and removes recording mistakes, silences & filler words",
      "Export pristine studio-grade audio ready to use",
    ],
  },
];

export default function VideoTypesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "reels" | "longform" | "tools">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectItem, setInspectItem] = useState<VideoTypeItem | null>(null);
  const [activeTab, setActiveTab] = useState<"grid" | "matrix" | "workflow">("grid");

  const filteredTypes = useMemo(() => {
    let result = ALL_VIDEO_TYPES;
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.includes(q)) ||
          item.input.toLowerCase().includes(q),
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_1000px_500px_at_50%_-100px,rgba(37,99,235,0.12),transparent_70%)]" />
        
        <div className="relative mx-auto max-w-7xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400">
            <Sparkles size={14} />
            <span>Free AI Video Generator &amp; Platform • 11 Workflows</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-foreground font-sans">
            AI Video Generator &amp; Maker Workflows
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            The best AI video generators for short-form reels, YouTube explainers, and text to video production. Select a workflow, upload your audio, video, or script, and generate studio-grade videos in seconds.
          </p>

          {/* Quick Metrics Pill */}
          <div className="mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[
              ["11", "AI Video Generators"],
              ["< 0.8s", "Speech Sync"],
              ["9:16 & 16:9", "Aspect Ratios"],
              ["Free Trial", "On Signup"],
            ].map(([stat, label]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-3.5 shadow-xs">
                <p className="text-xl font-black text-blue-600 dark:text-cyan-400">{stat}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Navigation & View Switcher Bar */}
      <section className="sticky top-16 z-40 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search AI video generators (captions, text to video, promo...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground outline-none transition focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: `All (${ALL_VIDEO_TYPES.length})` },
              { id: "reels", label: "Short Reels 9:16" },
              { id: "longform", label: "Long Form 16:9" },
              { id: "tools", label: "AI Audio Tools" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`shrink-0 rounded-2xl border px-4 py-2 text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? "border-blue-500 bg-blue-600 text-white shadow-md"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Cards vs Matrix) */}
          <div className="hidden lg:flex items-center gap-1 rounded-2xl border border-border bg-card p-1">
            <button
              onClick={() => setActiveTab("grid")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "grid" ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers size={13} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "matrix" ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders size={13} />
              <span>Specs Matrix</span>
            </button>
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">

          {/* GRID VIEW */}
          {activeTab === "grid" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Showing {filteredTypes.length} video styles
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  <span>Open Studio Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTypes.map((item) => (
                  <article
                    key={item.id}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl"
                  >
                    {/* Preview Image Container */}
                    <div className="relative aspect-[9/16] overflow-hidden bg-background">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                      {/* Top Badges */}
                      <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2">
                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md"
                          style={{ backgroundColor: item.accent }}
                        >
                          {item.proof}
                        </span>
                        <span className="rounded-full bg-muted/80 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                          <Film size={10} />
                          {item.aspectRatio}
                        </span>
                      </div>

                      {/* Title & Specs Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-black text-white leading-tight">{item.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-medium text-muted-foreground">
                          <span className="rounded-md bg-white/10 px-2 py-0.5 backdrop-blur-xs">
                            Inputs: {item.input}
                          </span>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 backdrop-blur-xs flex items-center gap-1">
                            <Clock size={10} />
                            {item.renderTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Description & Actions */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <p className="text-xs leading-relaxed text-muted-foreground min-h-[44px]">
                        {item.desc}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link
                          href={item.dashHref}
                          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2.5 text-xs font-black text-white shadow-md hover:brightness-110 transition"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Use Style</span>
                        </Link>
                        <Link
                          href={item.href}
                          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-cyan-300 hover:bg-white/10 transition"
                        >
                          <span>Deep Dive</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* SPECS MATRIX VIEW */}
          {activeTab === "matrix" && (
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="border-b border-border bg-muted/50 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4">Video Type Style</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Required Input</th>
                    <th className="p-4">Output Result</th>
                    <th className="p-4">Est. Render Time</th>
                    <th className="p-4">Credits</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border">
                  {filteredTypes.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.accent }} />
                        <span>{item.title}</span>
                      </td>
                      <td className="p-4">
                        <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px]">
                          {item.aspectRatio}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{item.input}</td>
                      <td className="p-4 font-medium">{item.output}</td>
                      <td className="p-4 text-muted-foreground">{item.renderTime}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-blue-600 dark:text-cyan-400 font-bold">
                          {item.credits} cr
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={item.dashHref}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-[11px] font-black text-white hover:bg-blue-500"
                        >
                          <span>Use</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty state */}
          {filteredTypes.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <p className="text-lg font-bold text-muted-foreground">No video types match your search filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-xs font-bold text-blue-600 dark:text-cyan-400"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Feature Deep-Dive Section */}
      <section className="border-t border-border px-4 py-16 sm:px-6 bg-card/40">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-foreground font-sans">
              Built for Speed &amp; Precision
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Every video type follows a strict 3-stage automated rendering architecture.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload &amp; Direct",
                desc: "Upload your raw audio, video, or images. Choose from custom colors and presenter styles.",
                icon: Wand2,
              },
              {
                step: "02",
                title: "Groq AI Processing",
                desc: "Speech is transcribed with sub-second timestamps and synced to kinetic animations.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "Cloud Remotion Render",
                desc: "Remotion Lambda renders clean 1080p MP4 exports with zero watermark on paid plans.",
                icon: Zap,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="rounded-3xl border border-border bg-card p-6 shadow-xs relative overflow-hidden">
                <span className="absolute top-4 right-4 text-3xl font-black text-muted-foreground/15 font-mono">
                  {step}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-black text-card-foreground" dangerouslySetInnerHTML={{ __html: title }} />
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSPECT MODAL */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute right-4 top-4 rounded-full border border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: inspectItem.accent }} />
              <div>
                <h3 className="text-xl font-black text-foreground">{inspectItem.title}</h3>
                <p className="text-xs text-muted-foreground font-semibold">{inspectItem.proof}</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">{inspectItem.desc}</p>

            {/* Workflow Steps */}
            <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Workflow Steps</p>
              <ol className="space-y-2 text-xs">
                {inspectItem.workflowSteps.map((step, idx) => (
                  <li key={step} className="flex items-start gap-2 text-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="leading-tight mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Required Input</span>
                <p className="font-bold text-foreground mt-0.5">{inspectItem.input}</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Output Format</span>
                <p className="font-bold text-foreground mt-0.5">{inspectItem.output}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-xs font-bold text-muted-foreground">
                Cost: <strong className="text-blue-600 dark:text-cyan-400">{inspectItem.credits} credit</strong> / render
              </span>
              <Link
                href={inspectItem.dashHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
              >
                <span>Launch in Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

