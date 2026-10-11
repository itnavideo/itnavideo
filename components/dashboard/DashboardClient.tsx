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
  aspectRatio: "9:16 & 16:9" | "9:16" | "16:9" | "Audio";
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  description: string;
  badge?: string;
  imageCard?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIDEO TOOL REGISTRY (9 UNIFIED TOOLS WITH 9:16 & 16:9 ASPECT PICKER)
// ─────────────────────────────────────────────────────────────────────────────

export const DASHBOARD_916_TOOLS: VideoToolCard[] = [
  {
    id: "auto-caption",
    title: "Auto Caption Generator",
    slug: "/dashboard/auto-caption",
    category: "social",
    aspectRatio: "9:16 & 16:9",
    icon: Captions,
    iconBgClass: "bg-orange-500/15 border border-orange-500/30",
    iconColorClass: "text-orange-400",
    description: "Add viral animated captions with word-by-word highlights in 9:16 or 16:9.",
    badge: "Trending",
    imageCard: "/visuals/homepage/autocaption.1.png",
  },
  {
    id: "faceless-video",
    title: "Faceless Video Generator",
    slug: "/dashboard/faceless-video",
    category: "long",
    aspectRatio: "9:16 & 16:9",
    icon: UserX,
    iconBgClass: "bg-indigo-500/15 border border-indigo-500/30",
    iconColorClass: "text-indigo-400",
    description: "Automated storytelling with AI voiceover, B-roll & music in 9:16 or 16:9.",
    badge: "AI Director",
    imageCard: "/visuals/homepage/faceless.png",
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard Animation",
    slug: "/dashboard/whiteboard-video",
    category: "social",
    aspectRatio: "9:16 & 16:9",
    icon: PenTool,
    iconBgClass: "bg-emerald-500/15 border border-emerald-500/30",
    iconColorClass: "text-emerald-400",
    description: "Hand-drawn animated whiteboard explainer videos in 9:16 or 16:9.",
    imageCard: "/visuals/homepage/whiteboard.1.png",
  },
  {
    id: "typography-video",
    title: "Kinetic Motion Video",
    slug: "/dashboard/typography-video",
    category: "social",
    aspectRatio: "9:16 & 16:9",
    icon: Type,
    iconBgClass: "bg-teal-500/15 border border-teal-500/30",
    iconColorClass: "text-teal-400",
    description: "11 high-energy kinetic motion text presets synced to your voice.",
    imageCard: "/visuals/homepage/typography.1.png",
  },
  {
    id: "compare-explainer",
    title: "Compare Explainer Video",
    slug: "/dashboard/compare-explainer",
    category: "social",
    aspectRatio: "9:16 & 16:9",
    icon: Columns,
    iconBgClass: "bg-violet-500/15 border border-violet-500/30",
    iconColorClass: "text-violet-400",
    description: "Side-by-side versus comparison videos with animated scorebars.",
    imageCard: "/visuals/homepage/compareexplainer.1.png",
  },
  {
    id: "image-to-video",
    title: "Image to Video AI",
    slug: "/dashboard/image-to-video",
    category: "long",
    aspectRatio: "9:16 & 16:9",
    icon: Sparkles,
    iconBgClass: "bg-amber-500/15 border border-amber-500/30",
    iconColorClass: "text-amber-400",
    description: "Transform scripts and photos into cinematic storytelling videos.",
    badge: "AI Storyboard",
    imageCard: "/visuals/homepage/imagetovideo.1.png",
  },
  {
    id: "book-summary",
    title: "Book Summary Video",
    slug: "/dashboard/book-summary",
    category: "long",
    aspectRatio: "9:16 & 16:9",
    icon: BookOpen,
    iconBgClass: "bg-rose-500/15 border border-rose-500/30",
    iconColorClass: "text-rose-400",
    description: "Turn any book narration audio into a captivating summary video.",
    imageCard: "/visuals/homepage/booksummary.png",
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
    description: "Turn long videos (up to 2 hours) into 60s viral Shorts in 1 click.",
    badge: "Up to 2h Input",
    imageCard: "/visuals/homepage/longvideotoviralclips.1.png",
  },
];

export const DASHBOARD_169_TOOLS: VideoToolCard[] = [];

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
    imageCard: "/visuals/homepage/audiocleaner.1.png",
  },
];

const ALL_TOOLS = [
  ...DASHBOARD_916_TOOLS,
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
  const [cardAspect, setCardAspect] = useState<"916" | "169">("916");
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
        <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
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
              {/* SECTION 1: 9:16 & 16:9 DUAL PIPELINE STUDIOS                  */}
              {/* ───────────────────────────────────────────────────────────── */}
              {show916Section && (
                <div className="rounded-[32px] border border-purple-500/20 bg-[#0A0912]/95 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden ring-1 ring-purple-500/10">
                  
                  {/* Banner Top Row */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 mb-8 sm:mb-10">
                    
                    {/* Left Typography */}
                    <div className="max-w-xl text-center lg:text-left">
                      <div className="mb-2 inline-flex items-center gap-2">
                        <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF8F00] tracking-wide">
                          AI-Powered
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider shadow-xs">
                          9:16 & 16:9 Dual Pipeline Engine
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
                        AI Video Creation Studios
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed">
                        Create viral <strong className="text-white">9:16 Shorts & Reels</strong> or high-impact <strong className="text-white">16:9 Widescreen Videos</strong>. Every studio supports both aspect ratios with instant 1080p cloud renders.
                      </p>
                    </div>

                    {/* Right Dual Aspect Ratio Mockups (16:9 Cinema + 9:16 Shorts Overlapping) */}
                    <div className="relative flex items-center justify-center shrink-0 py-2 sm:mr-4">
                      
                      {/* 16:9 Landscape Monitor Frame (Positioned behind) */}
                      <div className="relative group w-[220px] sm:w-[280px] aspect-[16/9] rounded-2xl border-2 border-purple-500/40 bg-zinc-950 p-1.5 shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] -mr-8 sm:-mr-12 mb-3">
                        <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-zinc-950 flex flex-col items-center justify-center">
                          <img
                            src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop"
                            alt="16:9 Cinema Widescreen Preview"
                            className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                          <div className="relative z-10 px-2 text-center mb-1">
                            <span className="font-extrabold text-white text-[11px] sm:text-xs drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-sans italic tracking-tight">
                              🖥️ 16:9 YouTube Widescreen
                            </span>
                          </div>

                          <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 border border-white/30 backdrop-blur-md shadow-lg group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:text-black transition-all">
                            <Play size={14} className="fill-current text-white group-hover:text-black ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-1 left-2.5 flex items-center gap-1 z-20">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                      </div>

                      {/* 9:16 Vertical Smartphone Frame (Overlapping in front) */}
                      <div className="relative group w-[110px] sm:w-[140px] aspect-[9/16] rounded-[22px] border-4 border-purple-500/60 bg-zinc-950 p-1 shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.04] z-10">
                        <div className="relative h-full w-full rounded-[16px] overflow-hidden bg-gradient-to-b from-pink-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center">
                          <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop"
                            alt="9:16 Vertical Video Preview"
                            className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                          <div className="relative z-10 px-1 text-center mb-2">
                            <span className="font-extrabold text-white text-[10px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-sans italic tracking-tight">
                              📱 9:16 Shorts
                            </span>
                          </div>

                          <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 border border-white/30 backdrop-blur-md shadow-lg group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:text-black transition-all">
                            <Play size={11} className="fill-current text-white group-hover:text-black ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-7 bg-zinc-800 rounded-full z-20" />
                      </div>

                    </div>
                  </div>

                  {/* Dual Aspect Ratio Indicator Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-b border-white/10 py-4 mb-8">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#FF6D00]/20 to-purple-500/20 border border-[#FF6D00]/40 text-[#FF9100] text-xs font-black uppercase tracking-wider">
                        ✨ Dual Pipeline Engine
                      </span>
                      <span className="text-xs font-bold text-zinc-300">
                        Every studio below supports both <strong className="text-white">📱 9:16 Vertical Shorts</strong> and <strong className="text-white">🖥️ 16:9 Widescreen Cinema</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                      <span className="text-[#FF9100] px-2.5 py-1 rounded-md bg-[#FF6D00]/10 border border-[#FF6D00]/30">📱 9:16 (Max 90s)</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-purple-300 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30">🖥️ 16:9 (Max 5 Min)</span>
                    </div>
                  </div>

                  {/* Template-First Gallery Grid: 3-Columns Large Desktop for Generous Breathing Room */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filtered916.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#12111E]/95 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/60 hover:bg-[#181628] hover:shadow-2xl hover:shadow-purple-500/20 active:scale-[0.98] cursor-pointer ring-1 ring-white/5"
                        >
                          {/* Dual Aspect Ratio Split Stage (16:9 Widescreen + 9:16 Vertical Phone side-by-side) */}
                          <div className="relative aspect-[16/10] w-full rounded-[24px] bg-[#080710] p-3 mb-4 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                            
                            {/* Ambient Back Sheen */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6D00]/15 via-purple-500/10 to-pink-500/15 opacity-70 group-hover:opacity-100 transition-opacity" />

                            {/* Left: 16:9 Widescreen Monitor Frame */}
                            <div className="relative w-[65%] aspect-[16/9] rounded-xl border border-purple-500/30 bg-zinc-950 shadow-2xl overflow-hidden -mr-6 z-10 transition-transform duration-300 group-hover:-translate-x-1.5">
                              <img
                                src={item.imageCard || "/visuals/homepage/autocaption.1.png"}
                                alt={item.title}
                                className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                              <span className="absolute top-1.5 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-extrabold text-purple-300 border border-purple-400/30">
                                🖥️ 16:9
                              </span>
                            </div>

                            {/* Right: 9:16 Smartphone Vertical Frame (Standing Front) */}
                            <div className="relative w-[38%] aspect-[9/16] rounded-[18px] border-2 border-purple-500/50 bg-zinc-950 p-0.5 shadow-2xl overflow-hidden z-20 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#FF6D00]">
                              <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-zinc-900">
                                <img
                                  src={item.imageCard || "/visuals/homepage/autocaption.1.png"}
                                  alt={item.title}
                                  className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1 w-5 bg-zinc-700 rounded-full z-30" />
                                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/90 text-[9px] font-black text-[#FF9100] border border-[#FF6D00]/50 whitespace-nowrap">
                                  📱 9:16
                                </span>
                              </div>
                            </div>

                            {/* Top Badge Tag */}
                            {item.badge && (
                              <div className="absolute top-3 left-3 z-30">
                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#FF6D00]/25">
                                  {item.badge}
                                </span>
                              </div>
                            )}

                            {/* Hover Play Button */}
                            <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6D00] text-black shadow-xl shadow-[#FF6D00]/50 scale-90 group-hover:scale-100 transition-transform">
                                <Play size={20} className="fill-current text-black ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Content Info */}
                          <div className="flex flex-col flex-1 justify-between p-1">
                            <div>
                              <div className="flex items-center gap-2.5 mb-2">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass}`}>
                                  <Icon size={16} />
                                </div>
                                <h3 className="text-base font-extrabold text-white tracking-tight group-hover:text-[#FF9100] transition-colors line-clamp-1">
                                  {item.title}
                                </h3>
                              </div>

                              {/* Dual Aspect Ratio Badges Row */}
                              <div className="flex items-center gap-2 mb-2.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FF6D00]/15 text-[#FF9100] border border-[#FF6D00]/30 font-extrabold text-[10px]">
                                  📱 9:16 Shorts (90s)
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-extrabold text-[10px]">
                                  🖥️ 16:9 Cinema (5m)
                                </span>
                              </div>

                              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Footer CTA */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-mono font-bold text-purple-300/80 uppercase tracking-wider">
                                Dual Aspect Engine
                              </span>
                              <span className="inline-flex items-center gap-1.5 font-bold text-[#FF9100] group-hover:translate-x-1 transition-transform text-xs bg-purple-500/10 group-hover:bg-[#FF6D00] group-hover:text-black px-3 py-1.5 rounded-xl border border-purple-500/30 group-hover:border-[#FF6D00]">
                                <span>Open Studio</span>
                                <ChevronRight size={14} />
                              </span>
                            </div>
                          </div>
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
                <div className="rounded-[32px] border border-purple-500/20 bg-[#0A0912]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden ring-1 ring-purple-500/10">
                  <div className="mb-6">
                    <span className="font-[family-name:var(--font-caveat)] text-2xl font-extrabold text-[#FF8F00] tracking-wide">
                      Studio Utility
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                      Audio Cleaning & Mastering
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-300">
                      Remove background noise, hum, and room echo to studio broadcast quality.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredUtility.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#12111E]/95 p-5 hover:border-purple-500/60 hover:bg-[#181628] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                              <Icon size={22} />
                            </div>
                            <div>
                              <div className="text-base font-bold text-white tracking-tight group-hover:text-[#FF9100] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-xs text-zinc-300 line-clamp-1 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            size={18}
                            className="shrink-0 text-zinc-400 group-hover:text-[#FF8F00] group-hover:translate-x-1 transition-all"
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
