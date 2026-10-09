"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/components/auth/AuthContext";
import DemoPreviewModal from "@/components/dashboard/DemoPreviewModal";
import WelcomeModal from "@/components/auth/WelcomeModal";
import DashboardSidebar, { DashboardTab } from "@/components/dashboard/DashboardSidebar";
import GeneratedVideosTab from "@/components/dashboard/GeneratedVideosTab";
import AnnouncementsTab from "@/components/dashboard/AnnouncementsTab";
import {
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
  LogOut,
  ChevronRight,
  LayoutGrid,
  List,
  Play,
  Film,
  Menu,
  BookOpen,
  Sparkles,
  Subtitles,
  FileImage,
  Mic,
  FileText,
  Box,
  Newspaper,
  Building2,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface VideoToolCard {
  id: string;
  title: string;
  slug: string;
  category: "long" | "social" | "utility";
  aspectRatio: "9:16" | "16:9" | "Audio";
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  description: string;
  badge?: string;
  imageCard?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIDEO TOOL REGISTRY (9:16, 16:9 & AUDIO)
// ─────────────────────────────────────────────────────────────────────────────

export const DASHBOARD_916_TOOLS: VideoToolCard[] = [
  {
    id: "auto-caption",
    title: "Auto Caption Generator",
    slug: "/dashboard/auto-caption",
    category: "social",
    aspectRatio: "9:16",
    icon: Captions,
    iconBgClass: "bg-orange-500/15 border border-orange-500/30",
    iconColorClass: "text-orange-400",
    description: "Add viral animated captions with word-by-word highlights and emojis.",
    badge: "Trending",
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard Animation",
    slug: "/dashboard/whiteboard-video",
    category: "social",
    aspectRatio: "9:16",
    icon: PenTool,
    iconBgClass: "bg-emerald-500/15 border border-emerald-500/30",
    iconColorClass: "text-emerald-400",
    description: "Hand-drawn animated whiteboard explainer videos for high retention.",
  },
  {
    id: "typography-video",
    title: "Kinetic Motion Video",
    slug: "/dashboard/typography-video",
    category: "social",
    aspectRatio: "9:16",
    icon: Type,
    iconBgClass: "bg-teal-500/15 border border-teal-500/30",
    iconColorClass: "text-teal-400",
    description: "11 high-energy kinetic motion presets synced to your voice.",
  },
  {
    id: "compare-explainer",
    title: "Compare Explainer Video",
    slug: "/dashboard/compare-explainer",
    category: "social",
    aspectRatio: "9:16",
    icon: Columns,
    iconBgClass: "bg-violet-500/15 border border-violet-500/30",
    iconColorClass: "text-violet-400",
    description: "Side-by-side versus comparison reels with animated scorebars.",
  },
  {
    id: "long-video-clips",
    title: "Viral Video Clips",
    slug: "/dashboard/long-video-clips",
    category: "social",
    aspectRatio: "9:16",
    icon: Scissors,
    iconBgClass: "bg-purple-500/15 border border-purple-500/30",
    iconColorClass: "text-purple-400",
    description: "Turn long podcasts into 60s viral Shorts in 1 click.",
    badge: "Popular",
  },
  {
    id: "long-video-promo",
    title: "Long Video Promotion",
    slug: "/dashboard/long-video-promo",
    category: "social",
    aspectRatio: "9:16",
    icon: Video,
    iconBgClass: "bg-blue-500/15 border border-blue-500/30",
    iconColorClass: "text-blue-400",
    description: "Convert long video recordings into high-converting teaser trailers.",
  },
];

export const DASHBOARD_169_TOOLS: VideoToolCard[] = [
  {
    id: "faceless-video",
    title: "Faceless Video Generator",
    slug: "/dashboard/faceless-video",
    category: "long",
    aspectRatio: "16:9",
    icon: UserX,
    iconBgClass: "bg-indigo-500/15 border border-indigo-500/30",
    iconColorClass: "text-indigo-400",
    description: "Automated 16:9 widescreen storytelling with AI voiceover, B-roll & music.",
    badge: "16:9 Widescreen",
  },
  {
    id: "image-to-video",
    title: "Image to Video AI",
    slug: "/dashboard/image-to-video",
    category: "long",
    aspectRatio: "16:9",
    icon: Sparkles,
    iconBgClass: "bg-amber-500/15 border border-amber-500/30",
    iconColorClass: "text-amber-400",
    description: "Transform scripts and photos into 16:9 cinematic storytelling videos.",
    badge: "AI Storyboard",
  },
  {
    id: "youtube-subtitles",
    title: "YouTube Subtitle Generator",
    slug: "/dashboard/youtube-subtitles",
    category: "long",
    aspectRatio: "16:9",
    icon: Subtitles,
    iconBgClass: "bg-red-500/15 border border-red-500/30",
    iconColorClass: "text-red-400",
    description: "Generate synchronized 16:9 subtitles with custom typography presets.",
  },
  {
    id: "book-summary",
    title: "Book Summary Video",
    slug: "/dashboard/book-summary",
    category: "long",
    aspectRatio: "16:9",
    icon: BookOpen,
    iconBgClass: "bg-rose-500/15 border border-rose-500/30",
    iconColorClass: "text-rose-400",
    description: "Turn any book narration audio into a captivating 16:9 summary video.",
  },
];

export const DASHBOARD_UTILITY_TOOLS: VideoToolCard[] = [
  {
    id: "audio-cleaner",
    title: "AI Audio Cleaner & Studio",
    slug: "/dashboard/audio-cleaner",
    category: "utility",
    aspectRatio: "Audio",
    icon: Music2,
    iconBgClass: "bg-teal-500/15 border border-teal-500/30",
    iconColorClass: "text-teal-400",
    description: "Remove background noise, hum, and room echo to studio broadcast quality.",
  },
];

const ALL_TOOLS = [
  ...DASHBOARD_916_TOOLS,
  ...DASHBOARD_169_TOOLS,
  ...DASHBOARD_UTILITY_TOOLS,
];

type CategoryFilter = "all" | "social" | "long" | "utility";
type ViewMode = "cards" | "detailed";

interface RecentRender {
  renderId: string;
  outputUrl?: string;
  outputFile?: string;
  title?: string;
  mode?: string;
  createdAt?: string;
  aspectRatio?: string;
}

const ROUTE_MAP: Record<string, string> = {
  "image-to-video": "/dashboard/image-to-video",
  "image-to-video-ai": "/dashboard/image-to-video",
  "auto-caption": "/dashboard/auto-caption",
  "auto-caption-reel": "/dashboard/auto-caption",
  "auto-caption-generator": "/dashboard/auto-caption",
  "compare-explainer": "/dashboard/compare-explainer",
  "whiteboard-video": "/dashboard/whiteboard-video",
  "typography-video": "/dashboard/typography-video",
  "long-video-promo": "/dashboard/long-video-promo",
  "long-video-clips": "/dashboard/long-video-clips",
  "faceless-video": "/dashboard/faceless-video",
  "youtube-subtitles": "/dashboard/youtube-subtitles",
  "audio-cleaner": "/dashboard/audio-cleaner",
  "ai-audio-cleaner": "/dashboard/audio-cleaner",
  "autoCaption": "/dashboard/auto-caption",
  "imageToVideoAi": "/dashboard/image-to-video",
  "compare": "/dashboard/compare-explainer",
  "typographyVideo": "/dashboard/typography-video",
  "autoDraw": "/dashboard/whiteboard-video",
  "longVideoPromo": "/dashboard/long-video-promo",
  "longVideoClips": "/dashboard/long-video-clips",
  "facelessVideo": "/dashboard/faceless-video",
  "youtubeSubtitles": "/dashboard/youtube-subtitles",
  "audioClean": "/dashboard/audio-cleaner",
  "videoExplainer": "/dashboard/auto-caption",
  "bookSummary": "/dashboard/book-summary",
  "book-summary": "/dashboard/book-summary",
  "book-summary-video": "/dashboard/book-summary",
};

// Hand-drawn Curved Arrows for Mockup Annotations
function HandDrawnArrow916() {
  return (
    <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF8F00] shrink-0">
      <path
        d="M10 12 C 25 8, 48 18, 38 42 M 38 42 L 30 36 M 38 42 L 44 34"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandDrawnArrow169() {
  return (
    <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF8F00] shrink-0">
      <path
        d="M12 10 C 32 10, 46 22, 36 44 M 36 44 L 28 38 M 36 44 L 42 36"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QueryRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const videoType = searchParams?.get("videoType");
    if (!videoType) return;

    const target = ROUTE_MAP[videoType];
    if (target) {
      router.replace(target);
    }
  }, [searchParams, router]);

  return null;
}

export default function DashboardClient() {
  const { user, logout } = useAuth();
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("studios");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [selectedDemoTool, setSelectedDemoTool] = useState<VideoToolCard | null>(null);

  // Fetch billing entitlement & credits with real-time refresh listeners
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

    const handleRefresh = () => fetchBilling();
    window.addEventListener("billing:refresh", handleRefresh);
    window.addEventListener("focus", handleRefresh);

    return () => {
      window.removeEventListener("billing:refresh", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [user]);

  // Fetch recent renders
  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          setRecentRenders(payload.renders.slice(0, 8));
        }
      } catch (err) {
        console.warn("Could not load render history:", err);
      }
    }
    fetchHistory();
  }, [user]);

  // Filter tools based on search query
  const filterBySearch = (tools: VideoToolCard[]) => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.trim().toLowerCase();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  };

  const filtered916 = useMemo(() => filterBySearch(DASHBOARD_916_TOOLS), [searchQuery]);
  const filtered169 = useMemo(() => filterBySearch(DASHBOARD_169_TOOLS), [searchQuery]);
  const filteredUtility = useMemo(() => filterBySearch(DASHBOARD_UTILITY_TOOLS), [searchQuery]);

  const show916Section = (activeCategory === "all" || activeCategory === "social") && filtered916.length > 0;
  const show169Section = (activeCategory === "all" || activeCategory === "long") && filtered169.length > 0;
  const showUtilitySection = (activeCategory === "all" || activeCategory === "utility") && filteredUtility.length > 0;

  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-[#FF6D00]/40 selection:text-[#FF8F00] max-w-full overflow-x-hidden relative">
      {/* Ambient Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#FF6D00]/15 via-[#FF8F00]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-[#FF6D00]/10 via-[#FF8F00]/5 to-transparent rounded-full blur-[160px]" />
      </div>

      <Suspense fallback={null}>
        <QueryRedirectHandler />
      </Suspense>

      {/* Demo Modal */}
      <DemoPreviewModal
        isOpen={!!selectedDemoTool}
        onClose={() => setSelectedDemoTool(null)}
        tool={selectedDemoTool as any}
      />

      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={dashboardTab}
        onSelectTab={(tab) => setDashboardTab(tab)}
        remainingCredits={remainingCredits ?? 10}
        renderedVideosCount={recentRenders.length}
        userEmail={user?.email ?? undefined}
        userId={user?.id}
        onLogout={logout}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Page Area with Left Sidebar Offset */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090A0F]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile Hamburger & Studio Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
                  <span className="font-bold tracking-wide">
                    {dashboardTab === "studios"
                      ? "Studio Hub"
                      : dashboardTab === "history"
                      ? "Export Library"
                      : "Changelog"}
                  </span>
                </span>
              </div>
            </div>

            {/* Quick Actions & Credits Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#FF6D00]/25 via-[#FF8F00]/15 to-amber-500/10 backdrop-blur-xl border border-[#FF6D00]/50 hover:border-[#FF6D00] transition-all text-xs font-black text-white shadow-[0_0_20px_rgba(255,109,0,0.2)] hover:shadow-[0_0_25px_rgba(255,109,0,0.4)] group cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF8F00] fill-[#FF8F00] animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-[#FFA726] font-black">
                  {remainingCredits !== null ? `${remainingCredits} Credits` : "10 Credits"}
                </span>
                <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-md">
                  +Add
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block text-xs text-slate-300 truncate max-w-[150px] px-3 py-1.5 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/15">
                    {user.email}
                  </span>
                  <button
                    onClick={() => logout()}
                    title="Sign out"
                    className="p-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 hover:border-[#FF6D00] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black text-xs font-black shadow-[0_0_20px_rgba(255,109,0,0.4)] transition-all hover:brightness-110 active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Tab Content Display */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {dashboardTab === "history" ? (
            /* Generated Videos Library Tab */
            <GeneratedVideosTab
              renders={recentRenders.map((r) => ({
                id: r.renderId,
                templateName: r.title || r.mode?.replace(/([A-Z])/g, " $1"),
                videoUrl: r.outputUrl || r.outputFile,
                downloadUrl: r.outputUrl || r.outputFile,
                createdAt: r.createdAt,
                aspectRatio: r.aspectRatio,
              }))}
              onOpenStudio={() => setDashboardTab("studios")}
            />
          ) : dashboardTab === "announcements" ? (
            /* Changelog Tab */
            <AnnouncementsTab />
          ) : (
            /* Default Studios Hub View */
            <div className="space-y-12 animate-fadeIn">
              
              {/* ── 1. Top Controls Bar: Category Pills & Search ── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 overflow-x-auto scrollbar-none shadow-md">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    ✨ All Studios ({ALL_TOOLS.length})
                  </button>
                  <button
                    onClick={() => setActiveCategory("social")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "social"
                        ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    📱 9:16 Vertical
                  </button>
                  <button
                    onClick={() => setActiveCategory("long")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "long"
                        ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    🖥️ 16:9 Cinema
                  </button>
                  <button
                    onClick={() => setActiveCategory("utility")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "utility"
                        ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    🎙️ Audio Studio
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search video studios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 focus:border-[#FF6D00] focus:bg-white/[0.14] focus:outline-none text-xs text-white placeholder:text-slate-400 transition-all font-medium"
                  />
                </div>
              </div>


              {/* ───────────────────────────────────────────────────────────── */}
              {/* SECTION 1: 9:16 VIDEO TYPES (ASPECT-RATIO BASED MOCKUP)      */}
              {/* ───────────────────────────────────────────────────────────── */}
              {show916Section && (
                <div className="rounded-[28px] border border-white/10 bg-[#070B14]/80 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                  
                  {/* Banner Top Row */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 mb-8 sm:mb-10">
                    
                    {/* Left Typography */}
                    <div className="max-w-xl text-center lg:text-left">
                      <div className="mb-1 inline-block">
                        <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF8F00] tracking-wide">
                          AI-Powered
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                        9:16 Video Types
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                        Create vertical videos for Reels, Shorts and TikTok. Choose from a wide range of AI-powered video types.
                      </p>
                    </div>

                    {/* Right Smartphone Preview & Annotation */}
                    <div className="relative flex items-center justify-center shrink-0 sm:mr-32">
                      
                      <div className="relative group w-[150px] sm:w-[190px] aspect-[9/16] rounded-[28px] border-4 border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                        <div className="relative h-full w-full rounded-[20px] overflow-hidden bg-gradient-to-b from-teal-900 via-sky-900 to-slate-950 flex flex-col items-center justify-center">
                          <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop"
                            alt="9:16 Vertical Video Preview"
                            className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                          <div className="relative z-10 px-2 text-center mb-3">
                            <span className="font-extrabold text-white text-base sm:text-xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-sans italic tracking-tight">
                              Good Vibes Only
                            </span>
                          </div>

                          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 border border-white/30 backdrop-blur-md shadow-lg group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:text-black transition-all">
                            <Play size={18} className="fill-current text-white group-hover:text-black ml-0.5" />
                          </div>
                        </div>

                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-2.5 w-14 bg-zinc-800 rounded-full z-20" />
                      </div>

                      <div className="absolute left-[calc(100%+6px)] top-4 hidden sm:flex items-center gap-1 pointer-events-none select-none">
                        <HandDrawnArrow916 />
                        <div className="flex flex-col text-left shrink-0">
                          <span className="font-[family-name:var(--font-caveat)] text-xl font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                            9:16
                          </span>
                          <span className="font-[family-name:var(--font-caveat)] text-lg font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                            Vertical Video
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Cards Grid: 4-Columns Desktop | 2-Column Compact Grid Mobile */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                    {filtered916.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#0E1526]/90 p-2.5 sm:p-3.5 hover:border-[#FF6D00]/50 hover:bg-[#151E30] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-[#FF6D00]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-1.5">
                            <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                              <Icon size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate group-hover:text-[#FF9100] transition-colors">
                              {item.title}
                            </span>
                          </div>

                          <ChevronRight
                            size={15}
                            className="shrink-0 text-zinc-500 group-hover:text-[#FF8F00] group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                  </div>

                </div>
              )}


              {/* ───────────────────────────────────────────────────────────── */}
              {/* SECTION 2: 16:9 VIDEO TYPES (ASPECT-RATIO BASED MOCKUP)     */}
              {/* ───────────────────────────────────────────────────────────── */}
              {show169Section && (
                <div className="rounded-[28px] border border-white/10 bg-[#070B14]/80 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                  
                  {/* Banner Top Row */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 mb-8 sm:mb-10">
                    
                    {/* Left Typography */}
                    <div className="max-w-xl text-center lg:text-left">
                      <div className="mb-1 inline-block">
                        <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF8F00] tracking-wide">
                          Popular
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                        16:9 Video Types
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                        Create horizontal videos for YouTube, presentations, explainer videos and more.
                      </p>
                    </div>

                    {/* Right Landscape Player Preview & Annotation */}
                    <div className="relative flex items-center justify-center shrink-0 sm:mr-32">
                      
                      <div className="relative group w-[250px] sm:w-[320px] aspect-[16/9] rounded-2xl border-4 border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                        <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-zinc-950 flex items-center justify-center">
                          <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
                            alt="16:9 Widescreen Video Preview"
                            className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                          <div className="relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 border border-white/30 backdrop-blur-md shadow-xl group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:text-black transition-all">
                            <Play size={20} className="fill-current text-white group-hover:text-black ml-0.5" />
                          </div>

                          <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                              <div className="h-full w-2/5 bg-[#FF6D00] rounded-full" />
                            </div>
                            <span className="text-[9px] font-mono font-bold text-zinc-300">HD</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute left-[calc(100%+6px)] top-4 hidden sm:flex items-center gap-1 pointer-events-none select-none">
                        <HandDrawnArrow169 />
                        <div className="flex flex-col text-left shrink-0">
                          <span className="font-[family-name:var(--font-caveat)] text-xl font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                            16:9
                          </span>
                          <span className="font-[family-name:var(--font-caveat)] text-lg font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                            Horizontal Video
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Cards Grid: 4-Columns Desktop | 2-Column Compact Grid Mobile */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                    {filtered169.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#0E1526]/90 p-2.5 sm:p-3.5 hover:border-[#FF6D00]/50 hover:bg-[#151E30] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-[#FF6D00]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-1.5">
                            <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                              <Icon size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate group-hover:text-[#FF9100] transition-colors">
                              {item.title}
                            </span>
                          </div>

                          <ChevronRight
                            size={15}
                            className="shrink-0 text-zinc-500 group-hover:text-[#FF8F00] group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                  </div>

                </div>
              )}


              {/* ───────────────────────────────────────────────────────────── */}
              {/* SECTION 3: AUDIO STUDIO & UTILITIES                            */}
              {/* ───────────────────────────────────────────────────────────── */}
              {showUtilitySection && (
                <div className="rounded-[28px] border border-white/10 bg-[#070B14]/80 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                  <div className="mb-6">
                    <span className="font-[family-name:var(--font-caveat)] text-2xl font-extrabold text-[#FF8F00] tracking-wide">
                      Studio Utility
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                      Audio Cleaning & Mastering
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                      Remove background noise, hum, and room echo to studio broadcast quality.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredUtility.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#0E1526]/90 p-4 hover:border-[#FF6D00]/50 hover:bg-[#151E30] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-[#FF6D00]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white tracking-tight group-hover:text-[#FF9100] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-xs text-zinc-400 line-clamp-1">
                                {item.description}
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            size={16}
                            className="shrink-0 text-zinc-500 group-hover:text-[#FF8F00] group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Empty Search Result */}
              {!show916Section && !show169Section && !showUtilitySection && (
                <div className="text-center py-16 border border-dashed border-white/20 rounded-[32px] bg-white/[0.04] backdrop-blur-2xl">
                  <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-200 font-bold">
                    No video studios match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-3 text-xs text-[#FF6D00] font-bold hover:underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Bottom Spacing */}
              <div className="pb-12 sm:pb-16" />
            </div>
          )}
        </main>
      </div>
      <WelcomeModal />
    </div>
  );
}
