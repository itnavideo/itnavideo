"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  Film,
  Video,
  Sparkles,
  Zap,
  CreditCard,
  BookOpen,
  LogOut,
  X,
  ExternalLink,
  ArrowRight,
  History,
  CheckCircle2,
  Clock,
  RotateCcw,
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
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

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
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Grounded Solid Dark Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#0B0F19] border-r border-white/10 text-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0E1526]/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-[#151E30] border border-white/10 group-hover:border-[#FF6D00]/50 transition-colors shadow-sm">
              <BrandLogo size="sm" iconOnly={true} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider text-white group-hover:text-[#FFA726] transition-colors">
                ITNAVIDEO
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9100]">
                AI VIDEO STUDIO
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl border border-white/10 bg-[#151E30] text-zinc-400 hover:text-white transition"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Credit Balance Card (Solid Grounded SaaS Design) */}
        <div className="p-4">
          <div className="rounded-2xl bg-[#121826] border border-white/10 p-4 shadow-xl relative overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Zap size={14} className="text-[#FF8F00] fill-[#FF8F00]" />
                <span>Credits</span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                1080p Cloud
              </span>
            </div>

            {/* Big Crisp Balance Display */}
            <div className="flex items-baseline gap-2 mb-3.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {remainingCredits}
              </span>
              <span className="text-xs font-bold text-zinc-400">
                {remainingCredits === 1 ? "Render Credit" : "Render Credits"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/pricing"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black text-xs shadow-md shadow-[#FF6D00]/20 hover:brightness-110 active:scale-98 transition-all"
              >
                <CreditCard size={14} />
                <span>+ Add Credits</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowUsageModal(true)}
                className="w-full text-center text-xs font-bold text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 py-1"
              >
                <span>View usage</span>
                <ArrowRight size={12} className="text-[#FF8F00]" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-1 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Section: CREATE */}
          <div>
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
              Create
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectTab("studios");
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                  activeTab === "studios"
                    ? "bg-[#151E30] border border-[#FF6D00]/60 text-white font-bold shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      activeTab === "studios"
                        ? "bg-[#FF6D00] text-black shadow-md shadow-[#FF6D00]/30"
                        : "bg-[#151E30] text-zinc-300 group-hover:text-[#FF8F00] border border-white/10"
                    }`}
                  >
                    <Film size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Video Studios</div>
                    <div className="text-[10px] text-zinc-400 truncate">10 AI Pipelines</div>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF6D00]/15 text-[#FF9100] border border-[#FF6D00]/30 shrink-0">
                  10 Tools
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectTab("history");
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                  activeTab === "history"
                    ? "bg-[#151E30] border border-emerald-500/60 text-white font-bold shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      activeTab === "history"
                        ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30"
                        : "bg-[#151E30] text-zinc-300 group-hover:text-emerald-400 border border-white/10"
                    }`}
                  >
                    <Video size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Generated Videos</div>
                    <div className="text-[10px] text-zinc-400 truncate">Export Cloud Library</div>
                  </div>
                </div>

                {renderedVideosCount > 0 && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {renderedVideosCount} Ready
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section: DISCOVER / RESOURCES */}
          <div>
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
              Discover & Resources
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectTab("announcements");
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                  activeTab === "announcements"
                    ? "bg-[#151E30] border border-amber-500/60 text-white font-bold shadow-md"
                    : "text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      activeTab === "announcements"
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                        : "bg-[#151E30] text-zinc-300 group-hover:text-amber-400 border border-white/10"
                    }`}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">What&apos;s New</div>
                    <div className="text-[10px] text-zinc-400 truncate">2026 Engine Updates</div>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                  NEW
                </span>
              </button>

              <Link
                href="/blog"
                className="w-full flex items-center justify-between p-3 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#151E30] text-zinc-300 border border-white/10 flex items-center justify-center group-hover:text-sky-400 transition-colors shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                      Guides & Blog
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">Safe Zones & Video SEO</div>
                  </div>
                </div>
                <ExternalLink size={14} className="text-zinc-400 group-hover:text-white shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* User Account / Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0E1526]/50">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#121826] border border-white/10 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6D00] to-[#FFA726] text-black font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-[#FF6D00]/30">
                {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate capitalize">
                  {userEmail
                    ? userEmail.includes("@")
                      ? userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)
                      : userEmail
                    : "Creator"}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Pro Plan Active</span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Credit Usage History Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FF6D00]/10 border border-[#FF6D00]/30 text-[#FF9100]">
                  <History size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Credit Usage History</h3>
                  <p className="text-xs text-zinc-400">Real-time breakdown of credit transactions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUsageModal(false)}
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Balance Summary Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151E30] border border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Available Balance</span>
                <span className="text-2xl font-black text-white">{remainingCredits} Credits</span>
              </div>
              <Link
                href="/pricing"
                onClick={() => setShowUsageModal(false)}
                className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-bold text-xs shadow hover:brightness-110 transition"
              >
                + Add Credits
              </Link>
            </div>

            {/* Usage Transactions List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {historyLoading ? (
                <div className="py-8 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                  <Clock size={16} className="animate-spin text-[#FF8F00]" />
                  <span>Loading usage history...</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-white/10 rounded-xl p-4">
                  No video generations recorded yet in this cycle.
                  <br />
                  Your full balance of <strong className="text-white">{remainingCredits} Render Credits</strong> is available.
                </div>
              ) : (
                transactions.map((item) => (
                  <div
                    key={item.renderId}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#121826] border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {item.status === "settled" ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : item.status === "reserved" ? (
                          <Clock size={16} className="text-amber-400 animate-pulse" />
                        ) : (
                          <RotateCcw size={16} className="text-sky-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-2">
                          <span className="capitalize">{item.mode}</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#FF9100]">
                        -{item.creditsConsumed} Credits
                      </span>
                      <span className="block text-[9px] font-mono text-zinc-400 capitalize">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 mt-4 text-right">
              <button
                type="button"
                onClick={() => setShowUsageModal(false)}
                className="py-2 px-4 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
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
