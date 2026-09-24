"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Sparkles,
  Subtitles,
  Captions,
  Columns,
  PenTool,
  Type,
  Video,
  Music2,
  Scissors,
  UserX,
  Search,
  ArrowRight,
  Zap,
  CreditCard,
  LogOut,
  User,
  ExternalLink,
  Layers,
  History,
  Download,
  Play,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface VideoToolCard {
  id: string;
  title: string;
  slug: string;
  category: "long" | "social" | "utility";
  categoryLabel: string;
  aspectRatio: string;
  aspectBadge: string;
  badge?: string;
  icon: LucideIcon;
  colorScheme: {
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    hoverBorder: string;
  };
  description: string;
  highlights: string[];
}

const VIDEO_TOOLS: VideoToolCard[] = [
  {
    id: "image-to-video",
    title: "Image to Video AI",
    slug: "/dashboard/image-to-video",
    category: "long",
    categoryLabel: "Cinema & Long Form",
    aspectRatio: "16:9",
    aspectBadge: "16:9 Cinema",
    badge: "Flagship",
    icon: Sparkles,
    colorScheme: {
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/30",
      badgeText: "text-amber-300",
      hoverBorder: "group-hover:border-amber-500/50",
    },
    description: "Transform voiceover audio & scene images into 16:9 cinema videos with Google AI voices and Ken Burns camera motion.",
    highlights: ["Up to 30 min limit", "Google AI Studio voices", "Consistent AI characters"],
  },
  {
    id: "youtube-subtitles",
    title: "YouTube Subtitle Generator",
    slug: "/dashboard/youtube-subtitles",
    category: "social",
    categoryLabel: "Social & YouTube",
    aspectRatio: "16:9 & 9:16",
    aspectBadge: "16:9 / 9:16",
    badge: "Popular",
    icon: Subtitles,
    colorScheme: {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      badgeBg: "bg-red-500/10",
      badgeBorder: "border-red-500/30",
      badgeText: "text-red-300",
      hoverBorder: "group-hover:border-red-500/50",
    },
    description: "Generate pixel-perfect synchronized subtitles for YouTube videos with custom typography presets and instant burn-in.",
    highlights: ["99% speech accuracy", "20+ subtitle presets", "Safe-margin auto fit"],
  },
  {
    id: "auto-caption",
    title: "Auto Caption Generator",
    slug: "/dashboard/auto-caption",
    category: "social",
    categoryLabel: "Social & YouTube",
    aspectRatio: "9:16",
    aspectBadge: "9:16 Shorts/Reels",
    badge: "Trending",
    icon: Captions,
    colorScheme: {
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      badgeBg: "bg-emerald-500/10",
      badgeBorder: "border-emerald-500/30",
      badgeText: "text-emerald-300",
      hoverBorder: "group-hover:border-emerald-500/50",
    },
    description: "Create viral Shorts, Reels, and TikTok captions with animated word-by-word highlights, emojis, and sound effects.",
    highlights: ["Word-level sync", "Alex Hormozi style", "Animated glow & bounce"],
  },
  {
    id: "faceless-video",
    title: "Faceless Video Generator",
    slug: "/dashboard/faceless-video",
    category: "social",
    categoryLabel: "Social & YouTube",
    aspectRatio: "9:16 & 16:9",
    aspectBadge: "9:16 / 16:9",
    badge: "High Demand",
    icon: UserX,
    colorScheme: {
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      badgeBg: "bg-indigo-500/10",
      badgeBorder: "border-indigo-500/30",
      badgeText: "text-indigo-300",
      hoverBorder: "group-hover:border-indigo-500/50",
    },
    description: "Create automated faceless channel videos from topic scripts with synchronized narration, stock B-roll, and music.",
    highlights: ["Script-to-video AI", "Automated stock B-roll", "Monetization ready"],
  },
  {
    id: "compare-explainer",
    title: "Compare Explainer Video",
    slug: "/dashboard/compare-explainer",
    category: "social",
    categoryLabel: "Social & YouTube",
    aspectRatio: "9:16 & 16:9",
    aspectBadge: "Versus Split",
    icon: Columns,
    colorScheme: {
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      badgeBg: "bg-blue-500/10",
      badgeBorder: "border-blue-500/30",
      badgeText: "text-blue-300",
      hoverBorder: "group-hover:border-blue-500/50",
    },
    description: "Side-by-side versus and product comparison reels with animated presenter stickers, scorebars, and dual viewpoints.",
    highlights: ["Dual-subject layout", "Animated stickers", "Dynamic scorebars"],
  },
  {
    id: "typography-video",
    title: "Kinetic Typography Video",
    slug: "/dashboard/typography-video",
    category: "social",
    categoryLabel: "Social & YouTube",
    aspectRatio: "9:16",
    aspectBadge: "9:16 Kinetic",
    icon: Type,
    colorScheme: {
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      badgeBg: "bg-orange-500/10",
      badgeBorder: "border-orange-500/30",
      badgeText: "text-orange-300",
      hoverBorder: "group-hover:border-orange-500/50",
    },
    description: "Punchy, fast-moving kinetic typography reels that sync with voice pace to keep audience watch time at peak retention.",
    highlights: ["Kinetic text motion", "Audience retention boost", "Sound effect sync"],
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard Animation",
    slug: "/dashboard/whiteboard-video",
    category: "social",
    categoryLabel: "Explainer & Marketing",
    aspectRatio: "16:9 & 9:16",
    aspectBadge: "Hand Sketch",
    icon: PenTool,
    colorScheme: {
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      badgeBg: "bg-cyan-500/10",
      badgeBorder: "border-cyan-500/30",
      badgeText: "text-cyan-300",
      hoverBorder: "group-hover:border-cyan-500/50",
    },
    description: "Hand-drawn animated whiteboard explainer videos perfect for business storytelling, tutorials, and pitch presentations.",
    highlights: ["Hand-sketch animation", "Sketch sound effects", "Clean whiteboard canvas"],
  },
  {
    id: "long-video-promo",
    title: "Long Video Promo / Teaser",
    slug: "/dashboard/long-video-promo",
    category: "long",
    categoryLabel: "Cinema & Long Form",
    aspectRatio: "16:9 & 9:16",
    aspectBadge: "Trailer Cut",
    icon: Video,
    colorScheme: {
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      badgeBg: "bg-purple-500/10",
      badgeBorder: "border-purple-500/30",
      badgeText: "text-purple-300",
      hoverBorder: "group-hover:border-purple-500/50",
    },
    description: "Convert long podcast or webinar recordings into high-converting promotional trailers and cinematic highlight teasers.",
    highlights: ["Hook cutdowns", "Trailer pacing", "Brand CTA badges"],
  },
  {
    id: "long-video-clips",
    title: "Long Video to Viral Clips",
    slug: "/dashboard/long-video-clips",
    category: "long",
    categoryLabel: "Cinema & Long Form",
    aspectRatio: "9:16",
    aspectBadge: "Auto Reframe",
    icon: Scissors,
    colorScheme: {
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      badgeBg: "bg-rose-500/10",
      badgeBorder: "border-rose-500/30",
      badgeText: "text-rose-300",
      hoverBorder: "group-hover:border-rose-500/50",
    },
    description: "Automatically identify the most captivating moments in long YouTube videos and reframe them into vertical viral shorts.",
    highlights: ["Virality detection", "Smart speaker tracking", "1-click short export"],
  },
  {
    id: "audio-cleaner",
    title: "AI Audio Cleaner & Studio",
    slug: "/dashboard/audio-cleaner",
    category: "utility",
    categoryLabel: "Audio & Utilities",
    aspectRatio: "Audio",
    aspectBadge: "Audio Utility",
    icon: Music2,
    colorScheme: {
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-400",
      badgeBg: "bg-teal-500/10",
      badgeBorder: "border-teal-500/30",
      badgeText: "text-teal-300",
      hoverBorder: "group-hover:border-teal-500/50",
    },
    description: "Remove background noise, hum, room echo, and optimize vocal clarity to professional broadcast quality.",
    highlights: ["Studio denoise", "Vocal presence boost", "Instant A/B preview"],
  },
];

type CategoryFilter = "all" | "social" | "long" | "utility";

interface RecentRender {
  renderId: string;
  outputUrl?: string;
  title?: string;
  mode?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Fetch billing entitlement & credits
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const used = Number(payload.usage?.used || 0);
          const limit = Number(payload.entitlement.monthlyVideoLimit || 1);
          setRemainingCredits(Math.max(0, Math.round(Number(payload.usage?.remaining || limit - used))));
        }
      } catch (err) {
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // Fetch recent renders
  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          setRecentRenders(payload.renders.slice(0, 4));
        }
      } catch (err) {
        console.warn("Could not load render history:", err);
      }
    }
    fetchHistory();
  }, [user]);

  // Filter tools
  const filteredTools = useMemo(() => {
    return VIDEO_TOOLS.filter((tool) => {
      const matchesCategory =
        activeCategory === "all" ? true : tool.category === activeCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.aspectBadge.toLowerCase().includes(q) ||
        tool.highlights.some((h) => h.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#07090E]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo size="md" />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Studio Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Credit Balance */}
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-amber-500/60 transition-colors text-xs font-medium text-zinc-200"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>
                {remainingCredits !== null ? `${remainingCredits} Credits` : "Credits"}
              </span>
              <span className="text-amber-400 text-[11px] font-semibold hover:underline">
                +Add
              </span>
            </Link>

            {/* User Profile / Logout */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-block text-xs text-zinc-400 truncate max-w-[140px]">
                  {user.email}
                </span>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Banner */}
        <div className="relative rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-900/20 to-transparent p-6 sm:p-10 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10 Dedicated Video & Audio Studios</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              AI Video Creation Studio
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Select any video type below to open its dedicated workspace with custom asset uploads, AI voices, Remotion render pipelines, and export tools.
            </p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Tools ({VIDEO_TOOLS.length})
            </button>
            <button
              onClick={() => setActiveCategory("social")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === "social"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Social & Shorts (5)
            </button>
            <button
              onClick={() => setActiveCategory("long")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === "long"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Cinema & Long Form (3)
            </button>
            <button
              onClick={() => setActiveCategory("utility")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === "utility"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Audio & Utilities (2)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tools or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 focus:outline-none text-xs text-zinc-200 placeholder:text-zinc-500 transition-colors"
            />
          </div>
        </div>

        {/* Video Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.slug}
                className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 ${tool.colorScheme.hoverBorder} hover:bg-zinc-900/70 transition-all duration-200 hover:-translate-y-1 shadow-sm`}
              >
                <div>
                  {/* Top Bar with Icon & Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${tool.colorScheme.iconBg} ${tool.colorScheme.iconColor} border border-white/5 transition-transform group-hover:scale-105`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {tool.badge && (
                        <span
                          className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${tool.colorScheme.badgeBg} ${tool.colorScheme.badgeBorder} ${tool.colorScheme.badgeText}`}
                        >
                          {tool.badge}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-md border border-zinc-700/40">
                        {tool.aspectBadge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Highlight Bullets */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tool.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-zinc-400 bg-zinc-800/40 border border-zinc-700/30 px-2 py-0.5 rounded-md"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors">
                  <span>Open Studio</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-800/80 group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
            <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-medium">No video tools match &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-3 text-xs text-amber-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Recent Renders Section */}
        {recentRenders.length > 0 && (
          <div className="mt-14 pt-8 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Rendered Videos
                </h2>
              </div>
              <span className="text-xs text-zinc-500">Stored securely for 48 hours</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentRenders.map((item) => (
                <div
                  key={item.renderId}
                  className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200 truncate">
                      {item.title || "Rendered Video"}
                    </p>
                    <p className="text-[11px] text-zinc-500 capitalize">
                      {item.mode ? item.mode.replace(/([A-Z])/g, " $1") : "Video"}
                    </p>
                  </div>
                  {item.outputUrl ? (
                    <a
                      href={item.outputUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 transition-colors flex-shrink-0"
                      title="Download MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
