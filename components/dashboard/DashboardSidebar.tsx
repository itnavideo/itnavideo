"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  Home,
  LayoutGrid,
  Film,
  Smartphone,
  Sparkles,
  Music2,
  Video,
  CreditCard,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  History,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  ExternalLink,
  Shield,
  HelpCircle,
} from "lucide-react";

export type DashboardTab = "studios" | "history" | "announcements";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  remainingCredits: number;
  renderedVideosCount: number;
  userEmail?: string;
  userId?: string;
  onLogout?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

type CreditTransaction = {
  renderId: string;
  createdAt: string;
  mode: string;
  title: string;
  creditUnits: number;
  creditsConsumed: number;
  status: "reserved" | "settled" | "released";
};

// 16:9 Long-Form Studio items
const CINEMA_169_ITEMS = [
  { id: "ai-video-generator", title: "AI Video Generator", href: "/dashboard/ai-video-generator", isNew: true },
  { id: "faceless-video", title: "Faceless Video (16:9)", href: "/dashboard/faceless-video" },
  { id: "youtube-subtitles", title: "Auto Caption (16:9 YouTube)", href: "/dashboard/youtube-subtitles" },
  { id: "ai-video-polisher", title: "AI Video Polisher (16:9)", href: "/dashboard/ai-video-polisher" },
  { id: "image-to-video", title: "Image to Video AI", href: "/dashboard/image-to-video" },
  { id: "book-summary", title: "Book Summary Video", href: "/dashboard/book-summary" },
];

// 9:16 Vertical Shorts Studio items
const SHORTS_916_ITEMS = [
  { id: "faceless-shorts", title: "Faceless Video (9:16)", href: "/dashboard/faceless-shorts" },
  { id: "auto-caption", title: "Auto Caption (9:16)", href: "/dashboard/auto-caption" },
  { id: "ai-shorts-polisher", title: "AI Video Polisher (9:16)", href: "/dashboard/ai-shorts-polisher" },
  { id: "whiteboard-video", title: "Whiteboard Animation", href: "/dashboard/whiteboard-video" },
  { id: "compare-explainer", title: "Compare Explainer", href: "/dashboard/compare-explainer" },
  { id: "long-video-clips", title: "Viral Video Clips", href: "/dashboard/long-video-clips" },
  { id: "long-video-promo", title: "Long Video Promo", href: "/dashboard/long-video-promo" },
  { id: "split-screen-explainer", title: "Split Screen Explainer", href: "/dashboard/split-screen-explainer" },
];

export default function DashboardSidebar({
  activeTab,
  onSelectTab,
  remainingCredits,
  renderedVideosCount,
  userEmail,
  userId,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  // Expandable Accordion States (matching Google Admin reference design)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cinema: true,
    shorts: false,
    audio: false,
    billing: true,
  });

  const [showAllItems, setShowAllItems] = useState(true);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch transaction history when modal opens
  useEffect(() => {
    if (!showUsageModal || !userId) return;
    async function fetchHistory() {
      setHistoryLoading(true);
      try {
        const res = await fetch(`/api/billing/history?userId=${encodeURIComponent(userId || "")}`);
        const data = await res.json().catch(() => ({}));
        if (data.ok && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.warn("Could not load credit usage history:", err);
      } finally {
        setHistoryLoading(false);
      }
    }
    fetchHistory();
  }, [showUsageModal, userId]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Google Admin Console Style Clean White Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-white border-r border-slate-200 text-slate-700 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header: Hamburger + Brand Logo (Matching Google Admin reference) */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 min-h-[58px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>

            <BrandLogo size="md" variant="light" href="/dashboard" />
          </div>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-[13px] font-medium select-none scrollbar-thin">
          
          {/* 1. Home / Dashboard */}
          <div
            onClick={() => {
              onSelectTab("studios");
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex items-center gap-3.5 px-3 py-2 rounded-full cursor-pointer transition-colors ${
              activeTab === "studios" && pathname === "/dashboard"
                ? "bg-[#E8F0FE] text-[#1967D2] font-semibold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Home size={18} className={activeTab === "studios" && pathname === "/dashboard" ? "text-[#1967D2]" : "text-slate-500"} />
            <span>Home</span>
          </div>

          {/* 2. Generated Videos (Export Cloud Library) */}
          <div
            onClick={() => {
              onSelectTab("history");
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-full cursor-pointer transition-colors ${
              activeTab === "history"
                ? "bg-[#E8F0FE] text-[#1967D2] font-semibold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Video size={18} className={activeTab === "history" ? "text-[#1967D2]" : "text-slate-500"} />
              <span>Generated Videos</span>
            </div>
            {renderedVideosCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {renderedVideosCount}
              </span>
            )}
          </div>

          <div className="my-2 border-t border-slate-100" />

          {/* 3. 16:9 Cinema Long-Form (Expandable with Google Admin Caret) */}
          <div>
            <div
              onClick={() => toggleSection("cinema")}
              className="flex items-center justify-between px-3 py-2 rounded-full cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {openSections.cinema ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <Film size={18} className="text-slate-500" />
                <span>16:9 Cinema</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-normal">6 Studios</span>
            </div>

            {/* Sub-Items Indented */}
            {openSections.cinema && (
              <div className="space-y-0.5 mt-0.5">
                {CINEMA_169_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={`flex items-center justify-between pl-10 pr-3 py-2 rounded-full transition-colors text-xs ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1967D2] font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.isNew && (
                        <span className="px-2 py-0.5 rounded-full bg-[#1A73E8] text-white text-[9px] font-extrabold uppercase tracking-wide">
                          NEW
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. 9:16 Vertical Shorts (Expandable with Caret) */}
          <div>
            <div
              onClick={() => toggleSection("shorts")}
              className="flex items-center justify-between px-3 py-2 rounded-full cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {openSections.shorts ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <Smartphone size={18} className="text-slate-500" />
                <span>9:16 Vertical Shorts</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-normal">8 Studios</span>
            </div>

            {/* Sub-Items Indented */}
            {openSections.shorts && (
              <div className="space-y-0.5 mt-0.5">
                {SHORTS_916_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={`flex items-center justify-between pl-10 pr-3 py-2 rounded-full transition-colors text-xs ${
                        isActive
                          ? "bg-[#E8F0FE] text-[#1967D2] font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Audio & Utility (Expandable) */}
          <div>
            <div
              onClick={() => toggleSection("audio")}
              className="flex items-center justify-between px-3 py-2 rounded-full cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {openSections.audio ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <Music2 size={18} className="text-slate-500" />
                <span>Audio Utilities</span>
              </div>
            </div>

            {openSections.audio && (
              <div className="space-y-0.5 mt-0.5">
                <Link
                  href="/dashboard/audio-cleaner"
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className={`flex items-center justify-between pl-10 pr-3 py-2 rounded-full transition-colors text-xs ${
                    pathname === "/dashboard/audio-cleaner"
                      ? "bg-[#E8F0FE] text-[#1967D2] font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>AI Audio Cleaner &amp; Studio</span>
                </Link>
              </div>
            )}
          </div>

          <div className="my-2 border-t border-slate-100" />

          {/* 6. Billing Section (Matching Google Admin Reference with Soft Pill) */}
          <div>
            <div
              onClick={() => toggleSection("billing")}
              className="flex items-center justify-between px-3 py-2 rounded-full cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {openSections.billing ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <CreditCard size={18} className="text-slate-500" />
                <span>Billing &amp; Credits</span>
              </div>
            </div>

            {openSections.billing && (
              <div className="space-y-0.5 mt-0.5">
                {/* Credit Balance Overview */}
                <div className="pl-10 pr-3 py-1.5 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} className="text-orange-500 fill-orange-500" />
                    <span>Balance</span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {remainingCredits} Credits
                  </span>
                </div>

                {/* Buy or Upgrade (Active Styled Rounded Pill Matching Reference) */}
                <Link
                  href="/pricing"
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className="flex items-center justify-between pl-10 pr-3 py-2 rounded-full bg-[#E8F0FE] text-[#1967D2] font-semibold transition-colors text-xs hover:bg-[#dbe7fd]"
                >
                  <span>Buy or Upgrade Plan</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#1967D2]/20">
                    +Add
                  </span>
                </Link>

                {/* Subscriptions / Usage */}
                <button
                  type="button"
                  onClick={() => setShowUsageModal(true)}
                  className="w-full text-left pl-10 pr-3 py-2 rounded-full text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Credit Usage &amp; History
                </button>
              </div>
            )}
          </div>

          <div className="my-2 border-t border-slate-100" />

          {/* 7. Account / Profile */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#1A73E8] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {userEmail
                    ? userEmail.includes("@")
                      ? userEmail.split("@")[0]
                      : userEmail
                    : "Creator Account"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{userEmail || "Pro Plan"}</p>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Show Less / Show More Pill (Matching Google Admin Reference) */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowAllItems(!showAllItems)}
              className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-[#1967D2] hover:bg-[#E8F0FE]/50 transition cursor-pointer shadow-2xs"
            >
              {showAllItems ? "Show less" : "Show more"}
            </button>
          </div>

        </div>
      </aside>

      {/* Credit Usage History Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600">
                  <History size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Credit Usage History</h3>
                  <p className="text-xs text-slate-500">Real-time breakdown of your video renders</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUsageModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Balance Summary Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Available Balance</span>
                <span className="text-2xl font-black text-slate-900">{remainingCredits} Credits</span>
              </div>
              <Link
                href="/pricing"
                onClick={() => setShowUsageModal(false)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:brightness-105 transition"
              >
                + Add Credits
              </Link>
            </div>

            {/* Usage Transactions List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
              {historyLoading ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Clock size={16} className="animate-spin text-orange-500" />
                  <span>Loading usage history...</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl p-4">
                  No video generations recorded yet in this billing cycle.
                  <br />
                  Your full balance of <strong className="text-slate-900">{remainingCredits} Render Credits</strong> is available.
                </div>
              ) : (
                transactions.map((item) => (
                  <div
                    key={item.renderId}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {item.status === "settled" ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : item.status === "reserved" ? (
                          <Clock size={16} className="text-amber-500 animate-pulse" />
                        ) : (
                          <RotateCcw size={16} className="text-sky-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{item.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2">
                          <span className="capitalize">{item.mode}</span>
                          <span>·</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-orange-600 block">
                        -{item.creditsConsumed} Credits
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 capitalize">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 mt-4 text-right">
              <button
                type="button"
                onClick={() => setShowUsageModal(false)}
                className="py-2 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
