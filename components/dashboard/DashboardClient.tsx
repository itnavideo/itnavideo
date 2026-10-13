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
// DASHBOARD VIDEO TOOL REGISTRY (9 UNIFIED TOOLS WITH 9:16 & 16:9 ASPECT PICKER)
// ─────────────────────────────────────────────────────────────────────────────

export const DASHBOARD_169_TOOLS: VideoToolCard[] = [
  {
    id: "faceless-video",
    title: "Faceless Video",
    slug: "/dashboard/faceless-video",
    category: "long",
    aspectRatio: "16:9",
    icon: UserX,
    iconBgClass: "bg-purple-500/15 border border-purple-500/30",
    iconColorClass: "text-purple-600",
    description: "Turn voiceovers & scripts into 16:9 YouTube explainers with AI B-roll & visuals.",
    badge: "Primary Focus",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png",
  },
  {
    id: "book-summary",
    title: "Book Summary Video",
    slug: "/dashboard/book-summary",
    category: "long",
    aspectRatio: "16:9",
    icon: BookOpen,
    iconBgClass: "bg-rose-500/15 border border-rose-500/30",
    iconColorClass: "text-rose-600",
    description: "Turn any book narration audio into a captivating 16:9 cinematic summary video.",
    badge: "Cinema Summary",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892528/book_summary_video_xjvjuf.png",
  },
  {
    id: "image-to-video",
    title: "Image to Video AI",
    slug: "/dashboard/image-to-video",
    category: "long",
    aspectRatio: "16:9",
    icon: Sparkles,
    iconBgClass: "bg-amber-500/15 border border-amber-500/30",
    iconColorClass: "text-amber-600",
    description: "Transform scripts and photos into cinematic 16:9 storytelling videos with motion pacing.",
    badge: "AI Storyboard",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791896597/imagetovideoai_akygiu.jpg",
  },
  {
    id: "youtube-subtitles",
    title: "YouTube Subtitles Generator",
    slug: "/dashboard/youtube-subtitles",
    category: "long",
    aspectRatio: "16:9",
    icon: Subtitles,
    iconBgClass: "bg-red-500/15 border border-red-500/30",
    iconColorClass: "text-red-600",
    description: "Generate accurate, styled 16:9 subtitles and captions for YouTube widescreen videos.",
    badge: "YouTube 16:9",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892530/youtube_subtitles_generator_nrgxle.png",
  },
];

export const DASHBOARD_916_TOOLS: VideoToolCard[] = [
  {
    id: "auto-caption",
    title: "Auto Caption Generator",
    slug: "/dashboard/auto-caption",
    category: "social",
    aspectRatio: "9:16",
    icon: Captions,
    iconBgClass: "bg-orange-500/15 border border-orange-500/30",
    iconColorClass: "text-orange-500",
    description: "Add viral animated captions with word-by-word highlights and emoji accents.",
    badge: "Trending",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png",
  },
  {
    id: "typography-video",
    title: "Kinetic Motion Video",
    slug: "/dashboard/typography-video",
    category: "social",
    aspectRatio: "9:16",
    icon: Type,
    iconBgClass: "bg-teal-500/15 border border-teal-500/30",
    iconColorClass: "text-teal-600",
    description: "11 high-energy kinetic motion text presets synced to your voice.",
    badge: "Kinetic Text",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892516/typography_kinetic_motion_lrpawu.png",
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard Animation",
    slug: "/dashboard/whiteboard-video",
    category: "social",
    aspectRatio: "9:16",
    icon: PenTool,
    iconBgClass: "bg-emerald-500/15 border border-emerald-500/30",
    iconColorClass: "text-emerald-600",
    description: "Hand-drawn animated whiteboard stickman explainer videos.",
    badge: "Doodle Explainer",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892527/whiteboard_video_wamtgr.png",
  },
  {
    id: "compare-explainer",
    title: "Compare Explainer Video",
    slug: "/dashboard/compare-explainer",
    category: "social",
    aspectRatio: "9:16",
    icon: Columns,
    iconBgClass: "bg-violet-500/15 border border-violet-500/30",
    iconColorClass: "text-violet-600",
    description: "Side-by-side versus comparison videos with animated scorebars.",
    badge: "Versus Battle",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892515/compare_explainer_wheox5.png",
  },
  {
    id: "long-video-promo",
    title: "Long Video Promo",
    slug: "/dashboard/long-video-promo",
    category: "social",
    aspectRatio: "9:16",
    icon: Film,
    iconBgClass: "bg-pink-500/15 border border-pink-500/30",
    iconColorClass: "text-pink-600",
    description: "Turn your long video into a high-converting teaser promo reel for social media.",
    badge: "Teaser Promo",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892524/longvideopromo_sq4ank.png",
  },
  {
    id: "long-video-clips",
    title: "Viral Video Clips",
    slug: "/dashboard/long-video-clips",
    category: "social",
    aspectRatio: "9:16",
    icon: Scissors,
    iconBgClass: "bg-purple-500/15 border border-purple-500/30",
    iconColorClass: "text-purple-600",
    description: "Turn long videos (up to 2 hours) into 60s viral Shorts in 1 click.",
    badge: "Up to 2h Input",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892526/viral_video_clips_hnlav3.png",
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
    iconColorClass: "text-teal-600",
    description: "Remove background noise, hum, and room echo to studio broadcast quality.",
    badge: "Audio Utility",
    imageCard: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892521/audio_cleaner_tzshum.png",
  },
];

const ALL_TOOLS = [
  ...DASHBOARD_169_TOOLS,
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
    <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF5722] shrink-0">
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
    <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF5722] shrink-0">
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
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-[#FF5722]/20 selection:text-[#FF5722] max-w-full overflow-x-hidden relative font-sans">
      {/* Subtle Ambient Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#FF5722]/8 via-[#FFA000]/4 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-[#FF5722]/6 via-[#FFA000]/3 to-transparent rounded-full blur-[160px]" />
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
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile Hamburger & Studio Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer shadow-xs"
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-500/30 hover:border-orange-500/60 transition-all text-xs font-bold text-orange-950 shadow-xs group cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722] animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-orange-900 font-black">
                  {remainingCredits !== null ? `${remainingCredits} Credits` : "10 Credits"}
                </span>
                <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm">
                  +Add
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block text-xs text-slate-600 truncate max-w-[150px] px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-medium">
                    {user.email}
                  </span>
                  <button
                    onClick={() => logout()}
                    title="Sign out"
                    className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all shadow-xs cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:opacity-95 active:scale-95"
                >
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
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/90 overflow-x-auto scrollbar-none shadow-xs">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    ✨ All Studios ({ALL_TOOLS.length})
                  </button>
                  <button
                    onClick={() => setActiveCategory("social")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "social"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    📱 9:16 Vertical
                  </button>
                  <button
                    onClick={() => setActiveCategory("long")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "long"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    🖥️ 16:9 Cinema
                  </button>
                  <button
                    onClick={() => setActiveCategory("utility")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "utility"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/15 focus:outline-none text-xs text-slate-900 placeholder:text-slate-400 transition-all font-medium shadow-xs"
                  />
                </div>
              </div>


              {/* ───────────────────────────────────────────────────────────── */}
              {/* SECTION 1: 16:9 VIDEO TYPES (FIRST ON DASHBOARD)              */}
              {/* ───────────────────────────────────────────────────────────── */}
              {show169Section && (
                <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-10 backdrop-blur-2xl shadow-xl relative overflow-hidden ring-1 ring-slate-100">
                  
                  {/* Banner Top Row */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 mb-8 sm:mb-10">
                    
                    {/* Left Typography */}
                    <div className="max-w-xl text-center lg:text-left">
                      <div className="mb-2 inline-flex items-center gap-2">
                        <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF5722] tracking-wide">
                          Popular
                        </span>
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] font-mono font-bold text-[#FF5722] uppercase tracking-wider shadow-xs">
                          16:9 Widescreen Cinema Engine
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                        16:9 Video Types
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                        Create horizontal videos for YouTube, presentations, documentary explainers, book summaries, and subtitles up to 10 minutes (<strong className="text-slate-900 font-bold">1 Min = 1 Credit</strong>).
                      </p>
                    </div>

                    {/* Right Landscape Player Preview & Annotation */}
                    <div className="relative flex items-center justify-center shrink-0 sm:mr-32">
                      <div className="relative group w-[250px] sm:w-[320px] aspect-[16/9] rounded-2xl border-4 border-slate-800 bg-[#070B14] p-1.5 shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                        <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-zinc-950 flex items-center justify-center">
                          <img
                            src="https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png"
                            alt="16:9 Widescreen Video Preview"
                            className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                          <div className="relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 border border-white/30 backdrop-blur-md shadow-xl group-hover:bg-[#FF5722] group-hover:border-[#FF5722] group-hover:text-white transition-all">
                            <Play size={20} className="fill-current text-white ml-0.5" />
                          </div>

                          <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                              <div className="h-full w-2/5 bg-gradient-to-r from-[#FF5722] to-[#FFA000] rounded-full" />
                            </div>
                            <span className="text-[9px] font-mono font-bold text-zinc-300">HD 1080p</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute left-[calc(100%+6px)] top-4 hidden sm:flex items-center gap-1 pointer-events-none select-none">
                        <HandDrawnArrow169 />
                        <div className="flex flex-col text-left shrink-0">
                          <span className="font-[family-name:var(--font-caveat)] text-xl font-bold text-[#FF5722] leading-none whitespace-nowrap">
                            16:9
                          </span>
                          <span className="font-[family-name:var(--font-caveat)] text-lg font-bold text-[#FF5722] leading-none whitespace-nowrap">
                            Horizontal Video
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 16:9 Indicator Sub-bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-b border-slate-100 py-3.5 mb-8">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[#FF5722] text-xs font-black uppercase tracking-wider">
                        🖥️ 16:9 Widescreen Format
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        Optimized for <strong className="text-slate-900">YouTube, TV Displays & Web</strong> (1920×1080 Full HD)
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                      <span className="text-orange-700 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30">Max 10 Minutes</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-purple-700 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30">1 Min = 1 Credit</span>
                    </div>
                  </div>

                  {/* 16:9 Cards Gallery Grid: 4 Columns on Large Screen */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                    {filtered169.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 active:scale-[0.98] cursor-pointer ring-1 ring-slate-100 shadow-sm"
                        >
                          {/* 16:9 Featured Widescreen Image Stage */}
                          <div className="relative aspect-[16/9] w-full rounded-[20px] bg-[#070B14] mb-4 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center group-hover:border-orange-500/40 transition-colors">
                            <img
                              src={item.imageCard || "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png"}
                              alt={item.title}
                              className="h-full w-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            {/* Center Play Button on Hover */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-xl shadow-orange-500/50 scale-90 group-hover:scale-100 transition-transform">
                                <Play size={18} className="fill-current text-white ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Card Content Info */}
                          <div className="flex flex-col flex-1 justify-between">
                            <div>
                              <div className="flex items-center gap-2.5 mb-2">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass}`}>
                                  <Icon size={16} />
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-[#FF5722] transition-colors line-clamp-1">
                                  {item.title}
                                </h3>
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Footer CTA */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-mono font-bold text-slate-500">
                                1 Min = 1 Cr
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-white text-xs bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-3.5 py-1.5 rounded-xl shadow-md shadow-orange-500/20 group-hover:translate-x-0.5 group-hover:shadow-lg transition-all">
                                <span>Create</span>
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
              {/* SECTION 2: 9:16 ALL VIDEO CLIPS / SHORTS (SECOND ON DASHBOARD) */}
              {/* ───────────────────────────────────────────────────────────── */}
              {show916Section && (
                <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-10 backdrop-blur-2xl shadow-xl relative overflow-hidden ring-1 ring-slate-100">
                  
                  {/* Banner Top Row */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 mb-8 sm:mb-10">
                    
                    {/* Left Typography */}
                    <div className="max-w-xl text-center lg:text-left">
                      <div className="mb-2 inline-flex items-center gap-2">
                        <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF5722] tracking-wide">
                          AI-Powered
                        </span>
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] font-mono font-bold text-[#FF5722] uppercase tracking-wider shadow-xs">
                          9:16 Vertical Video Engine
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                        9:16 Video Clips &amp; Shorts
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                        Create viral <strong className="text-slate-900 font-bold">9:16 Shorts, Reels &amp; TikToks</strong> with auto captions, kinetic motion text, whiteboard animations, and viral clip re-framing up to 90 seconds (<strong className="text-slate-900 font-bold">1 Credit per video</strong>).
                      </p>
                    </div>

                    {/* Right 9:16 Smartphone Frame with Annotation */}
                    <div className="relative flex items-center justify-center shrink-0 sm:mr-32">
                      <div className="relative group w-[130px] sm:w-[150px] aspect-[9/16] rounded-[26px] border-4 border-slate-800 bg-[#070B14] p-1 shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.04]">
                        <div className="relative h-full w-full rounded-[20px] overflow-hidden bg-gradient-to-b from-purple-950 via-slate-900 to-zinc-950 flex flex-col items-center justify-center">
                          <img
                            src="https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png"
                            alt="9:16 Vertical Video Preview"
                            className="absolute inset-0 h-full w-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                          <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/30 backdrop-blur-md shadow-lg group-hover:bg-[#FF5722] group-hover:border-[#FF5722] group-hover:text-white transition-all">
                            <Play size={14} className="fill-current text-white ml-0.5" />
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 z-10 text-center">
                            <span className="font-extrabold text-white text-[9px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-sans italic tracking-tight">
                              📱 9:16 Vertical
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-7 bg-zinc-800 rounded-full z-20" />
                      </div>

                      <div className="absolute left-[calc(100%+6px)] top-4 hidden sm:flex items-center gap-1 pointer-events-none select-none">
                        <HandDrawnArrow916 />
                        <div className="flex flex-col text-left shrink-0">
                          <span className="font-[family-name:var(--font-caveat)] text-xl font-bold text-[#FF5722] leading-none whitespace-nowrap">
                            9:16
                          </span>
                          <span className="font-[family-name:var(--font-caveat)] text-lg font-bold text-[#FF5722] leading-none whitespace-nowrap">
                            Vertical Video
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 9:16 Indicator Sub-bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-b border-slate-100 py-3.5 mb-8">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[#FF5722] text-xs font-black uppercase tracking-wider">
                        📱 9:16 Vertical Shorts Format
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        Optimized for <strong className="text-slate-900">Instagram Reels, TikTok &amp; YouTube Shorts</strong> (1080×1920 Full HD)
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                      <span className="text-orange-700 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30">Max 90 Seconds</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">1 Credit / Video</span>
                    </div>
                  </div>

                  {/* 9:16 Cards Gallery Grid: Responsive 6-Item Grid with 9:16 Preview Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
                    {filtered916.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 active:scale-[0.98] cursor-pointer ring-1 ring-slate-100 shadow-sm"
                        >
                          {/* 9:16 Featured Vertical Smartphone Preview Stage */}
                          <div className="relative aspect-[9/16] w-full rounded-[22px] bg-[#070B14] mb-3.5 border border-slate-800 overflow-hidden shadow-inner flex flex-col items-center justify-center group-hover:border-orange-500/40 transition-colors">
                            <img
                              src={item.imageCard || "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png"}
                              alt={item.title}
                              className="h-full w-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-6 bg-zinc-700 rounded-full z-20" />

                            {/* Center Play Button on Hover */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-xl shadow-orange-500/50 scale-90 group-hover:scale-100 transition-transform">
                                <Play size={16} className="fill-current text-white ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Card Content Info */}
                          <div className="flex flex-col flex-1 justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                                  <Icon size={14} />
                                </div>
                                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-[#FF5722] transition-colors line-clamp-1">
                                  {item.title}
                                </h3>
                              </div>

                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Footer CTA */}
                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-mono font-bold text-slate-500">
                                1 Credit
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-white text-[11px] bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-3 py-1 rounded-lg shadow-sm group-hover:translate-x-0.5 transition-all">
                                <span>Create</span>
                                <ChevronRight size={12} />
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
              {/* SECTION 3: AUDIO STUDIO & UTILITIES (THIRD ON DASHBOARD)       */}
              {/* ───────────────────────────────────────────────────────────── */}
              {showUtilitySection && (
                <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 backdrop-blur-2xl shadow-xl relative overflow-hidden ring-1 ring-slate-100">
                  <div className="mb-6">
                    <span className="font-[family-name:var(--font-caveat)] text-2xl font-extrabold text-[#FF5722] tracking-wide">
                      Studio Utility
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                      Audio Cleaning &amp; Mastering
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">
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
                          className="group relative flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 hover:border-orange-500/40 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                              <Icon size={22} />
                            </div>
                            <div>
                              <div className="text-base font-bold text-slate-900 tracking-tight group-hover:text-[#FF5722] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            size={18}
                            className="shrink-0 text-slate-400 group-hover:text-[#FF5722] group-hover:translate-x-1 transition-all"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Empty Search Result */}
              {!show916Section && !show169Section && !showUtilitySection && (
                <div className="text-center py-16 border border-dashed border-slate-300 rounded-[32px] bg-slate-50 backdrop-blur-2xl">
                  <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-700 font-bold">
                    No video studios match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-3 text-xs text-[#FF5722] font-bold hover:underline cursor-pointer"
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
