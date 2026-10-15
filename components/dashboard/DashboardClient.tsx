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
  Download,
  UploadCloud,
  Clock3,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
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
    badge: "🔥 Most In-Demand",
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
    badge: "Cinema Chapters",
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
    badge: "Parallax Motion",
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
    badge: "1080p Subtitles",
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
    badge: "Word-Synced",
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
    badge: "Dynamic Typography",
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
    badge: "Versus Split",
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
    badge: "AI Hook Detector",
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
    badge: "Studio Master",
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
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  // Fetch billing entitlement & credits with real-time refresh listeners
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(user?.email || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const used = Number(payload.usage?.used || 0);
          const limit = Number(payload.entitlement.monthlyVideoLimit || 1);
          setRemainingCredits(Math.max(0, Math.round(Number(payload.usage?.remaining ?? (limit - used)))));
        } else if (
          user?.email?.toLowerCase() === "rohi@itnavideo.com" ||
          user?.email?.toLowerCase() === "itnavideo@gmail.com" ||
          user?.id === "a50a8342-f362-4f49-adfe-fc7a9a4e14db"
        ) {
          setRemainingCredits(908);
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

  const isFounder = Boolean(
    user?.email?.toLowerCase() === "rohi@itnavideo.com" ||
    user?.email?.toLowerCase() === "itnavideo@gmail.com" ||
    user?.email?.toLowerCase().includes("rohi") ||
    user?.email?.toLowerCase().includes("syed") ||
    user?.id === "a50a8342-f362-4f49-adfe-fc7a9a4e14db"
  );

  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-[#FF5722]/30 selection:text-white max-w-full overflow-x-hidden relative font-sans">
      {/* Subtle Ambient Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#FF5722]/10 via-[#FFA000]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-[#FF5722]/8 via-[#FFA000]/4 to-transparent rounded-full blur-[160px]" />
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
        remainingCredits={remainingCredits ?? (isFounder ? 908 : 1)}
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
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur-xl shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile Hamburger & Studio Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-white/10 bg-[#0E1526] text-zinc-300 hover:text-white hover:bg-[#141B2D] transition cursor-pointer shadow-xs"
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1526] border border-white/10 text-xs text-zinc-300">
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-500/10 border border-orange-500/40 hover:border-orange-500/70 transition-all text-xs font-bold text-orange-200 shadow-xs group cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722] animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-orange-300 font-black">
                  {remainingCredits !== null ? `${remainingCredits} Credits` : (isFounder ? "908 Credits" : "...")}
                </span>
                {isFounder ? (
                  <span className="inline-block rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm">
                    Founder
                  </span>
                ) : (
                  <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm">
                    +Add
                  </span>
                )}
              </Link>

              {user && !isFounder && (
                <Link
                  href="/pricing"
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-white/10 bg-[#0E1526] hover:bg-[#141B2D] transition shadow-xs"
                >
                  <span>Upgrade Plan</span>
                  <ArrowUpRight size={13} className="text-[#FF5722]" />
                </Link>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white text-xs font-bold hover:brightness-110 transition shadow-md shadow-orange-500/20"
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
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B0F19] border border-white/10 overflow-x-auto scrollbar-none shadow-xs">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    ✨ All Studios ({ALL_TOOLS.length})
                  </button>
                  <button
                    onClick={() => setActiveCategory("social")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "social"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    📱 9:16 Vertical
                  </button>
                  <button
                    onClick={() => setActiveCategory("long")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "long"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🖥️ 16:9 Cinema
                  </button>
                  <button
                    onClick={() => setActiveCategory("utility")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === "utility"
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🎙️ Audio Studio
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search video studios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0B0F19] border border-white/10 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none text-xs text-white placeholder:text-zinc-500 transition-all font-medium shadow-xs"
                  />
                </div>
              </div>


              {/* ── FAST DRAG-AND-DROP STUDIO LAUNCHER ── */}
              {searchQuery === "" && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = e.dataTransfer.files;
                    if (!files || files.length === 0) return;
                    const file = files[0];
                    if (file.type.startsWith("audio/")) {
                      router.push("/dashboard/faceless-video");
                    } else {
                      router.push("/dashboard/auto-caption");
                    }
                  }}
                  className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all duration-200 ${
                    isDragging
                      ? "border-[#FF5722] bg-orange-500/10 scale-[1.01]"
                      : "border-white/10 bg-[#0B0F19]/80 hover:border-white/20 hover:bg-[#0E1526]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#FF5722]">
                        <UploadCloud size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">
                          Instant Studio Launcher
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Drop voiceover audio to launch <strong className="text-white font-bold">16:9 Faceless Video</strong>, or video to launch <strong className="text-white font-bold">9:16 Auto Caption</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/dashboard/faceless-video"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:brightness-105 transition"
                      >
                        <span>Faceless Video (16:9)</span>
                        <ChevronRight size={12} />
                      </Link>
                      <Link
                        href="/dashboard/auto-caption"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition"
                      >
                        <span>Auto Caption (9:16)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 2. RECENT CLOUD RENDERS (48h Retention Lifecycle, Only Completed Renders) ── */}
              {recentRenders.filter((r) => Boolean(r.outputUrl || r.outputFile)).length > 0 && searchQuery === "" && activeCategory === "all" && (
                <div className="rounded-[28px] border border-white/10 bg-[#0D111D] p-5 sm:p-7 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                          Recent Cloud Renders
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 size={11} />
                          <span>Ready for Download</span>
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Preserved in cloud storage for 48 hours. Download your 1080p Full HD MP4 directly.
                      </p>
                    </div>

                    <button
                      onClick={() => setDashboardTab("history")}
                      className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-[#FFA000] hover:text-[#FF7043] transition cursor-pointer"
                    >
                      <span>View All in Export Library</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentRenders.filter((r) => Boolean(r.outputUrl || r.outputFile)).slice(0, 4).map((render) => {
                      const videoUrl = render.outputUrl || render.outputFile || "";
                      const displayTitle = render.title || "Itnavideo Project";
                      const filename = `${displayTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-1080p.mp4`;

                      return (
                        <div
                          key={render.renderId}
                          className="group relative flex flex-col justify-between rounded-2xl border border-white/10 p-4 bg-[#121624] hover:bg-[#161C2E] hover:border-orange-500/40 transition-all shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-zinc-300">
                                {render.aspectRatio || (render.mode?.toLowerCase().includes("faceless") || render.mode?.toLowerCase().includes("summary") ? "16:9" : "9:16")}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-zinc-400">
                                <Clock3 size={11} className="text-[#FF5722]" />
                                <span>48h Cloud</span>
                              </span>
                            </div>

                            <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#FFA000] transition-colors">
                              {displayTitle}
                            </h3>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              {render.createdAt ? new Date(render.createdAt).toLocaleDateString() : "Just now"} · 1080p MP4
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/10">
                            <a
                              href={videoUrl}
                              download={filename}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
                            >
                              <Download size={13} />
                              <span>Download</span>
                            </a>
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition"
                              title="Preview in new tab"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SECTION 1: 16:9 VIDEO TYPES (FIRST ON DASHBOARD)              */}
              {/* ───────────────────────────────────────────────────────────── */}
              {show169Section && (
                <div className="rounded-[32px] border border-white/10 bg-[#0D111D] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
                  
                  {/* Clean Spacious Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                        <Sparkles size={13} className="text-[#FF5722]" />
                        <span>16:9 Widescreen Cinema Studios</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                        YouTube &amp; Long-Form Video Studios
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                        Full HD 1080p horizontal videos for YouTube channels, documentary explainers, presentations, and chapter book summaries.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center text-xs font-mono font-bold">
                      <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
                        1920×1080 Full HD
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FFA000]">
                        2 Credits / Video
                      </span>
                    </div>
                  </div>

                  {/* 16:9 Cards Gallery Grid: Responsive 4-Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {filtered169.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[#121624] p-4.5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:bg-[#161C2E] hover:shadow-xl hover:shadow-orange-500/10 active:scale-[0.98] cursor-pointer shadow-md"
                        >
                          {/* 16:9 Featured Widescreen Image Stage */}
                          <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#070B14] mb-4 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center group-hover:border-orange-500/40 transition-colors">
                            <img
                              src={item.imageCard || "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png"}
                              alt={item.title}
                              className="h-full w-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            {/* Badge Tag on Image */}
                            {item.badge && (
                              <div className="absolute top-2.5 right-2.5 z-10">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-black/80 border border-white/20 text-white backdrop-blur-md shadow-sm">
                                  {item.badge}
                                </span>
                              </div>
                            )}

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
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                                  <Icon size={15} />
                                </div>
                                <h3 className="text-sm font-extrabold text-white tracking-tight group-hover:text-[#FFA000] transition-colors line-clamp-2">
                                  {item.title}
                                </h3>
                              </div>

                              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Footer CTA */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-mono font-bold text-zinc-400">
                                2 Credits
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-white text-[11px] bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-3 py-1.5 rounded-xl shadow-md shadow-orange-500/20 group-hover:translate-x-0.5 transition-all">
                                <span>Create</span>
                                <ChevronRight size={13} />
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
                <div className="rounded-[32px] border border-white/10 bg-[#0D111D] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
                  
                  {/* Clean Spacious Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                        <Sparkles size={13} className="text-[#FF5722]" />
                        <span>9:16 Vertical Shorts &amp; Reels</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                        Shorts, Reels &amp; TikTok Studios
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                        Create viral vertical videos with auto captions, kinetic motion text, whiteboard animations, and teaser promos up to 90 seconds.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center text-xs font-mono font-bold">
                      <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
                        1080×1920 Full HD
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        1 Credit / Video · Max 90s
                      </span>
                    </div>
                  </div>

                  {/* 9:16 Cards Gallery Grid: Exactly 3 Columns on Large Screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {filtered916.map((item) => {
                      const Icon = item.icon;
                      const isClips = item.id === "long-video-clips";

                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[#121624] p-4.5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:bg-[#161C2E] hover:shadow-xl hover:shadow-orange-500/10 active:scale-[0.98] cursor-pointer shadow-md"
                        >
                          {/* 9:16 Featured Vertical Smartphone Preview Stage */}
                          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-[#070B14] mb-3.5 border border-white/10 overflow-hidden shadow-inner flex flex-col items-center justify-center group-hover:border-orange-500/40 transition-colors">
                            <img
                              src={item.imageCard || "https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png"}
                              alt={item.title}
                              className="h-full w-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                            {/* Badge Tag on Image */}
                            {item.badge && (
                              <div className="absolute top-2.5 right-2.5 z-10">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-black/80 border border-white/20 text-white backdrop-blur-md shadow-sm">
                                  {item.badge}
                                </span>
                              </div>
                            )}

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
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                                  <Icon size={14} />
                                </div>
                                <h3 className="text-sm font-extrabold text-white tracking-tight group-hover:text-[#FFA000] transition-colors line-clamp-2">
                                  {item.title}
                                </h3>
                              </div>

                              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Footer CTA */}
                            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-mono font-bold text-zinc-400">
                                {isClips ? "2 Credits / Clip" : "1 Credit"}
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-white text-[11px] bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-3 py-1.5 rounded-xl shadow-md shadow-orange-500/20 group-hover:translate-x-0.5 transition-all">
                                <span>Create</span>
                                <ChevronRight size={13} />
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
                <div className="rounded-[32px] border border-white/10 bg-[#0D111D] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-white/10 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                        <Mic size={13} className="text-teal-400" />
                        <span>Studio Utility &amp; Audio Clean</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                        Audio Cleaning &amp; Mastering
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                        Remove background noise, hum, room echo, and retakes to broadcast standard.
                      </p>
                    </div>

                    <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold self-start sm:self-center">
                      1 Credit · Studio Clean
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredUtility.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.slug}
                          className="group relative flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#121624] hover:bg-[#161C2E] p-5 sm:p-6 hover:border-orange-500/40 transition-all duration-200 active:scale-[0.99] shadow-md hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform shadow-sm`}>
                              <Icon size={24} />
                            </div>
                            <div>
                              <div className="text-base font-black text-white tracking-tight group-hover:text-[#FFA000] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-xs text-zinc-400 mt-1 max-w-xl">
                                {item.description}
                              </div>
                            </div>
                          </div>

                          {/* 3 Core Verified Feature Pills */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-zinc-300">
                              -14dB Noise Isolation
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-zinc-300">
                              Auto Retake Cut
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-zinc-300">
                              EBU R128 Loudness
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 font-bold text-white text-xs bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 group-hover:translate-x-0.5 transition-all shrink-0">
                            <span>Open Audio Studio</span>
                            <ChevronRight size={14} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Empty Search Result */}
              {!show916Section && !show169Section && !showUtilitySection && (
                <div className="text-center py-16 border border-dashed border-white/15 rounded-[32px] bg-[#0E1526]/50 backdrop-blur-2xl">
                  <Search className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                  <p className="text-sm text-zinc-300 font-bold">
                    No video studios match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-3 text-xs text-[#FFA000] font-bold hover:underline cursor-pointer"
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
