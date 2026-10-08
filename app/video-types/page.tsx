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
  featureBadge?: string;
  featureChips?: string[];
  workflowSteps: [string, string, string];
};

const ALL_VIDEO_TYPES: VideoTypeItem[] = [
  {
    id: "youtube-subtitle-generator",
    title: "YouTube Subtitle Generator",
    desc: "Broadcast-quality, word-synced animated subtitles for 16:9 landscape YouTube videos, podcasts, and lectures with TV & scrubber safe zones.",
    aspectRatio: "16:9",
    input: "16:9 Landscape Video",
    output: "1080p Subtitled Video",
    renderTime: "~30s",
    credits: 1,
    category: "longform",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_000000005540821181b6095da390b68b_qumuqg.png",
    href: "/video-types/youtube-subtitle-generator",
    dashHref: "/dashboard?videoType=youtube-subtitle-generator",
    tags: ["youtube subtitles", "16:9 subtitles", "ali abdaal", "vox documentary", "closed captions"],
    proof: "9 Western Styles",
    accent: "#2563EB",
    featureBadge: "New: 9 Tier-1 Western Styles",
    featureChips: ["Ali Abdaal & Vox Docu", "Safe Zone Margins", "UPPERCASE / Natural"],
    workflowSteps: [
      "Upload 16:9 horizontal video",
      "Select Ali Abdaal, Vox, or Diary of a CEO preset",
      "Export 1080p burned-in subtitled video",
    ],
  },
  {
    id: "auto-caption-generator",
    title: "Auto Caption Generator",
    desc: "AI auto caption generator for Instagram Reels, Shorts, and TikToks. Word-by-word animated subtitles synced to speech with custom positions, colors, and fonts.",
    aspectRatio: "9:16",
    input: "Video / Audio",
    output: "Captioned Reel / Video",
    renderTime: "~20s",
    credits: 1,
    category: "reels",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_000000005540821181b6095da390b68b_qumuqg.png",
    href: "/auto-captions",
    dashHref: "/dashboard?videoType=auto-caption-generator",
    tags: ["auto caption generator", "captions for instagram", "subtitles", "ai captions", "viral"],
    proof: "100k+ High Search",
    accent: "#FF6D00",
    featureBadge: "Interactive SFX",
    featureChips: ["Pop SFX Toggle", "Word Bounce & Glow", "6 Brand Color Swatches"],
    workflowSteps: [
      "Upload video or voice clip",
      "AI transcribes speech and detects timestamps",
      "Renders animated captions with custom layout",
    ],
  },
  {
    id: "compare-explainer",
    title: "Compare Explainer Video",
    desc: "Side-by-side concept comparison reel featuring animated sticker presenter, dual images, pacing control, and synced narration.",
    aspectRatio: "9:16",
    input: "Audio track + 2 images",
    output: "Side-by-side comparison reel",
    renderTime: "~30s",
    credits: 1,
    category: "reels",
    image: "https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_ouesss.png",
    href: "/compare-explainer",
    dashHref: "/dashboard?videoType=compare-explainer",
    tags: ["comparison", "vs", "education", "explainer", "products"],
    proof: "A vs B Format",
    accent: "#F59E0B",
    featureBadge: "Narration Pace",
    featureChips: ["1.0x - 1.25x Pacing", "🥊 Tension BGM Beat", "👑 Winner Reveal"],
    workflowSteps: [
      "Upload audio or record narration",
      "Upload Left vs Right subject images",
      "Render dual-column comparison with animated presenter",
    ],
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard Explainer Studio",
    desc: "Extracts key bullet points from speech and writes them onto a sleek digital whiteboard with drawing hands, styluses, and executive marker colors.",
    aspectRatio: "9:16",
    input: "Audio or Video file",
    output: "Interactive whiteboard reel",
    renderTime: "~35s",
    credits: 1,
    category: "reels",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_000000003c2882118520991dc7d2d827_alfyoc.png",
    href: "/whiteboard-video",
    dashHref: "/dashboard?videoType=whiteboard-video",
    tags: ["whiteboard", "education", "notes", "summary", "teaching"],
    proof: "Full Studio",
    accent: "#10B981",
    featureBadge: "New: Whiteboard Studio",
    featureChips: ["🎨 Blueprint & Dark Glass", "✍️ Hand & Stylus Modes", "Executive Marker Swatches"],
    workflowSteps: [
      "Upload speech or video lesson",
      "AI extracts structured key takeaways",
      "Renders dynamic whiteboard animation with captions",
    ],
  },
  {
    id: "typography-video",
    title: "Kinetic Typography Video",
    desc: "Big, bold, high-energy kinetic text overlays popping to speech beats with punch SFX intensity, blitz pacing, and casing controls.",
    aspectRatio: "9:16",
    input: "Video file",
    output: "Kinetic typography reel",
    renderTime: "~20s",
    credits: 1,
    category: "reels",
    image: "https://storage.googleapis.com/itnavideo-media-assets/Typography_Video_sitlxz.png",
    href: "/typography-video",
    dashHref: "/dashboard?videoType=typography-video",
    tags: ["typography", "bold", "text", "viral", "energy"],
    proof: "Viral Kinetic",
    accent: "#8B5CF6",
    featureBadge: "Kinetic SFX",
    featureChips: ["💥 Punch SFX Intensity", "⚡ Viral Blitz Pacing", "UPPERCASE / Natural"],
    workflowSteps: [
      "Upload talking video file",
      "System isolates speech beats & emphasis keywords",
      "Renders bold animated typography overlays",
    ],
  },
  {
    id: "long-video-promo",
    title: "Long Video Promo",
    desc: "Converts long YouTube videos or podcasts into high-converting vertical trailer teasers with thumbnail callouts, channel handle tag, and CTA buttons.",
    aspectRatio: "9:16",
    input: "Video + YouTube Thumbnail",
    output: "Vertical teaser trailer with CTA",
    renderTime: "~30s",
    credits: 1,
    category: "reels",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_000000002d508209b398a35503a053e1_uiytox.png",
    href: "/long-video-promo",
    dashHref: "/dashboard?videoType=long-video-promo",
    tags: ["youtube", "promo", "podcast", "teaser", "shorts"],
    proof: "YouTube Growth",
    accent: "#EC4899",
    featureBadge: "Channel Branding",
    featureChips: ["@Channel Tag Input", "4 High-Converting CTAs", "Ambient Canvas Blur"],
    workflowSteps: [
      "Upload long video snippet + thumbnail",
      "Adds animated headline title & watch CTA",
      "Exports high-converting trailer for Reels & Shorts",
    ],
  },
  {
    id: "long-video-clips",
    title: "Long Video Clips",
    desc: "AI identifies highest-energy viral moments from long videos and auto-cuts captioned clips in 9:16, 16:9, or 1:1 framing with teaser hook banners.",
    aspectRatio: "9:16",
    input: "Long video file or URL",
    output: "Multiple captioned short clips",
    renderTime: "~40s",
    credits: 1,
    category: "longform",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_000000002af082088dc89d221c90dc80_tmf4h8.png",
    href: "/long-video-clips",
    dashHref: "/dashboard?videoType=long-video-clips",
    tags: ["clips", "repurpose", "podcast", "highlights", "viral"],
    proof: "Multi-Aspect",
    accent: "#10B981",
    featureBadge: "New: 16:9 & 1:1 Framing",
    featureChips: ["🔥 AI Hook Strategies", "Top Teaser Banners", "Multi-Aspect Framing"],
    workflowSteps: [
      "Provide long video source file",
      "AI detects highlight hooks and cuts key moments",
      "Renders captioned vertical clip reel",
    ],
  },
  {
    id: "faceless-video",
    title: "Faceless Video",
    desc: "Turn voiceover audio up to 20 minutes into complete 16:9 widescreen YouTube videos with kinetic pan/zoom pacing, ambient lo-fi/tech soundtracks & captions.",
    aspectRatio: "16:9",
    input: "Voiceover (Up to 20 Min)",
    output: "16:9 Widescreen Video",
    renderTime: "~60s",
    credits: 3,
    category: "longform",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_0000000089c48211b67c16fe3c2636a2_prirg0.png",
    href: "/faceless-video",
    dashHref: "/dashboard?videoType=faceless-video",
    tags: ["ai video generator", "text to video", "youtube long video", "b-roll", "subtitles"],
    proof: "YouTube Longform",
    accent: "#38BDF8",
    featureBadge: "Retention Motion",
    featureChips: ["⚡ Kinetic Pan & Zoom", "☕ Lo-Fi & Tech BGM", "Voice-Music Balance"],
    workflowSteps: [
      "Upload audio voiceover, video, or script",
      "AI detects timestamps, matches B-roll & background music",
      "Exports complete 1080p full-length video",
    ],
  },
  {
    id: "ai-audio-cleaner",
    title: "AI Audio Cleaner",
    desc: "Upload long audio recordings. AI displays the full script, removes retakes and silences, and masters sound with 24-bit WAV export and podcast warmth EQ.",
    aspectRatio: "Audio",
    input: "Long Audio (MP3, WAV, M4A)",
    output: "Cleaned Studio Audio + Full Script",
    renderTime: "~15s",
    credits: 1,
    category: "tools",
    image: "https://storage.googleapis.com/itnavideo-media-assets/file_0000000084e482119c5951ac67c32219_lncnaa.png",
    href: "/tools/ai-audio-cleaner",
    dashHref: "/dashboard?videoType=ai-audio-cleaner",
    tags: ["audio", "clean", "podcast", "voiceover", "silence removal", "script"],
    proof: "Broadcast Studio",
    accent: "#EAB308",
    featureBadge: "New: Studio Master EQ",
    featureChips: ["Studio WAV 24-bit Lossless", "🎙️ Podcast Warmth Curve", "31+ Sentence Retakes Cut"],
    workflowSteps: [
      "Upload long voiceover or podcast audio recording",
      "AI displays full script preview and removes recording mistakes, silences & filler words",
      "Export pristine studio-grade audio ready to use",
    ],
  },
  {
    id: "image-to-video-ai",
    title: "Image to Video AI",
    desc: "Transform voiceover narration and photos into cinematic 16:9 widescreen videos with Ken Burns camera motion, transitions, and 2.5D parallax subtitles.",
    aspectRatio: "16:9",
    input: "Voiceover + Photos",
    output: "16:9 Cinematic Video",
    renderTime: "~45s",
    credits: 2,
    category: "longform",
    image: "https://storage.googleapis.com/itnavideo-media-assets/ChatGPT_Image_Sep_7_2026_04_53_09_PM_suv9x7.png",
    href: "/tools/image-to-video-ai",
    dashHref: "/dashboard?videoType=imageToVideoAi",
    tags: ["image to video", "ken burns", "photo to video", "slideshow", "cinematic"],
    proof: "Cinematic Motion",
    accent: "#8B5CF6",
    featureBadge: "New: Scene Transitions",
    featureChips: ["Crossfade & Whip Pan", "Speech-Sync Pacing", "2.5D Parallax Subtitles"],
    workflowSteps: [
      "Upload voiceover and photos",
      "Select Ken Burns motion & cut transition",
      "Export 1080p 30 FPS widescreen video",
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_1000px_500px_at_50%_-100px,rgba(255,109,0,0.12),transparent_70%)]" />
        
        <div className="relative mx-auto max-w-7xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-bold text-[#FF9100]">
            <Sparkles size={14} />
            <span>AI Video Creation Suite • 10 Audited & Upgraded Studios</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-foreground font-sans">
            AI Video Generator &amp; Creator Studios
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Professional AI video generation for short-form reels, 16:9 YouTube explainers, kinetic typography, and broadcast-grade audio mastering. Equipped with authentic Western creator presets, safe zones, and multi-aspect framing.
          </p>

          {/* Quick Metrics Pill */}
          <div className="mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[
              ["10 Studios", "Audited & Live"],
              ["9 Styles", "Tier-1 Western Presets"],
              ["9:16, 16:9, 1:1", "Aspect Ratios"],
              ["24-Bit WAV", "Studio Master Audio"],
            ].map(([stat, label]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-3.5 shadow-xs">
                <p className="text-xl font-black text-[#FF9100]">{stat}</p>
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
              className="w-full rounded-2xl border border-border bg-card py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground outline-none transition focus:border-[#FF6D00]"
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
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: "all", label: `All (${ALL_VIDEO_TYPES.length})` },
              { id: "reels", label: "Short Reels 9:16" },
              { id: "longform", label: "Long Form 16:9" },
              { id: "tools", label: "AI Audio Tools" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`min-h-[40px] shrink-0 rounded-2xl border px-4 py-2 text-xs font-bold transition touch-manipulation active:scale-95 ${
                  selectedCategory === cat.id
                    ? "border-[#FF6D00] bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black shadow-md"
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
                activeTab === "grid" ? "bg-[#FF6D00] text-black font-extrabold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers size={13} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "matrix" ? "bg-[#FF6D00] text-black font-extrabold" : "text-muted-foreground hover:text-foreground"
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
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF9100] hover:underline"
                >
                  <span>Open Studio Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTypes.map((item) => (
                  <article
                    key={item.id}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6D00]/50 hover:shadow-xl hover:shadow-[#FF6D00]/10"
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.id === "auto-caption-generator" ? (
                            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                              🎁 1 Free Trial
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#FF6D00] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
                              ⭐ Pro Studio
                            </span>
                          )}
                          <span
                            className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md"
                            style={{ backgroundColor: item.accent }}
                          >
                            {item.proof}
                          </span>
                        </div>
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
                      <div>
                        {item.featureBadge && (
                          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[11px] font-black text-[#FF9100]">
                            <Sparkles size={11} className="text-[#FF8F00]" />
                            <span>{item.featureBadge}</span>
                          </div>
                        )}
                        <p className="text-xs leading-relaxed text-muted-foreground min-h-[44px]">
                          {item.desc}
                        </p>
                        {item.featureChips && item.featureChips.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.featureChips.map((chip, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-lg border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-foreground/80"
                              >
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link
                          href={item.dashHref}
                          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-3 py-2.5 text-xs font-black text-black shadow-md hover:brightness-110 transition touch-manipulation active:scale-[0.98]"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Use Style</span>
                        </Link>
                        <Link
                          href={item.href}
                          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-zinc-200 hover:bg-white/10 transition touch-manipulation active:scale-[0.98]"
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
                      <td className="p-4 font-bold">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.accent }} />
                          <span>{item.title}</span>
                        </div>
                        {item.featureBadge && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-[#FF9100] pl-4">
                            {item.featureBadge}
                          </span>
                        )}
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
                        <span className="rounded-full bg-[#FF6D00]/10 px-2.5 py-0.5 text-[#FF9100] font-bold">
                          {item.credits} cr
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={item.dashHref}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#FF6D00] px-3 py-1.5 text-[11px] font-black text-black hover:brightness-110"
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
                className="rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-5 py-2.5 text-xs font-bold text-[#FF9100]"
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
                title: "Precision AI Speech Processing",
                desc: "Speech is transcribed with sub-second timestamps and synced to kinetic animations.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "1080p Cloud Render",
                desc: "Cloud render engine exports clean 1080p MP4 videos with zero watermark on paid plans.",
                icon: Zap,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="rounded-3xl border border-border bg-card p-6 shadow-xs relative overflow-hidden">
                <span className="absolute top-4 right-4 text-3xl font-black text-muted-foreground/15 font-mono">
                  {step}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] mb-4">
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
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6D00] text-[10px] font-black text-black">
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
                Cost: <strong className="text-[#FF9100]">{inspectItem.credits} credit</strong> / render
              </span>
              <Link
                href={inspectItem.dashHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-5 py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110"
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

