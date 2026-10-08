'use client';

import React, { useEffect, useState } from "react";
import { getAdminOverviewStats, getAdminUsers, type AdminUser } from "../actions";
import {
  TrendingUp,
  Users,
  Film,
  Coins,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Shield,
  Zap,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  Lock,
  Download,
  AlertTriangle,
  CreditCard,
  UserCheck,
  IndianRupee,
  Activity,
  Calendar,
  Layers,
  ArrowRight,
  BarChart3,
  PieChart,
  UserPlus
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, usersRes] = await Promise.all([
        getAdminOverviewStats(),
        getAdminUsers(search, planFilter),
      ]);
      setStats(statsRes);
      setUsers(usersRes);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin telemetry.");
    } finally {
      setLoading(false);
      setUsersLoading(false);
    }
  }

  async function reloadUsers() {
    try {
      setUsersLoading(true);
      const usersRes = await getAdminUsers(search, planFilter);
      setUsers(usersRes);
    } catch (err: any) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      reloadUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, planFilter]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-[#0E1526] border border-white/10 rounded-[28px] p-6 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="h-7 w-56 bg-white/10 rounded" />
          </div>
          <div className="h-10 w-10 bg-white/10 rounded-2xl" />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-[#0E1526] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-8 w-28 bg-white/10 rounded" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-80 bg-[#0E1526] border border-white/10 rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-[28px] border border-red-500/30 bg-red-950/20 p-8 text-center space-y-4">
        <AlertTriangle className="text-red-400 mx-auto" size={40} />
        <h3 className="text-base font-bold text-white">Telemetry Sync Timeout</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadData}
          className="px-5 py-2.5 rounded-full bg-[#151E30] border border-white/15 text-xs font-bold text-white hover:bg-[#1C2840] transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, trends, recentPayments } = stats;

  const paidRatio = kpis.usersCount > 0
    ? Math.round((kpis.paidUsersCount / kpis.usersCount) * 100)
    : 0;

  const maxDailySignup = Math.max(...(trends.dailySignupActivity?.map((x: any) => x.signups) || [1]), 5);
  const maxDailyRender = Math.max(...(trends.dailySignupActivity?.map((x: any) => x.renders) || [1]), 5);

  return (
    <div className="space-y-7 pb-16 text-zinc-100">

      {/* ─── Top Header ────────────────────────────────────────────── */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6D00] shadow-[0_0_8px_#FF6D00] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF9100]">
              Itnavideo Intelligence &amp; User Registry
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Real-time user growth, today vs yesterday signups, video types telemetry, and user credit ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/15 bg-[#151E30] text-xs font-bold text-white hover:bg-[#1C2840] hover:text-[#FFA726] transition active:scale-95"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black text-xs font-black shadow-md shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
          >
            <Users size={15} /> All Users
          </Link>
          <Link
            href="/admin/revenue"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/15 bg-[#151E30] text-white text-xs font-bold hover:bg-[#1C2840] transition active:scale-95"
          >
            <IndianRupee size={15} className="text-emerald-400" /> Revenue
          </Link>
        </div>
      </div>

      {/* ─── KPI Scorecards Grid (Including Today & Yesterday Signups) ─────────────────────────── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

        {/* 1. Today Signups */}
        <div className="rounded-[24px] border border-[#FF6D00]/40 bg-[#0E1526] p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#FFA726] uppercase tracking-wider">Today Signups</span>
            <div className="h-8 w-8 rounded-xl bg-[#FF6D00]/15 border border-[#FF6D00]/30 flex items-center justify-center text-[#FF9100]">
              <UserPlus size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{kpis.signupsToday}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className={`font-black ${kpis.signupGrowthVsYesterday >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {kpis.signupGrowthVsYesterday >= 0 ? `+${kpis.signupGrowthVsYesterday}%` : `${kpis.signupGrowthVsYesterday}%`}
              </span>
              <span className="text-zinc-400">vs yesterday ({kpis.signupsYesterday})</span>
            </div>
          </div>
        </div>

        {/* 2. Yesterday Signups */}
        <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Yesterday Signups</span>
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <Calendar size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{kpis.signupsYesterday}</div>
            <div className="mt-1 text-xs text-zinc-400">Previous 24h cycle</div>
          </div>
        </div>

        {/* 3. Total Registered Creators */}
        <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Total Creators</span>
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF9100]">
              <Users size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{kpis.usersCount}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-emerald-400 font-bold">{kpis.paidUsersCount} Paid</span>
              <span>·</span>
              <span>{kpis.freeUsersCount} Free</span>
            </div>
          </div>
        </div>

        {/* 4. Total Cloud Renders */}
        <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Total Renders</span>
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <Film size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{kpis.totalRendersCount}</div>
            <div className="mt-1 text-xs text-zinc-400">
              <span className="text-emerald-400 font-bold">{kpis.rendersToday} today</span> · {Math.round(kpis.successRate)}% success
            </div>
          </div>
        </div>

        {/* 5. Credits Utilized */}
        <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Credits Consumed</span>
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFA726]">
              <Coins size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{Math.round(kpis.totalCreditsUsed)}</div>
            <div className="mt-1 text-xs text-zinc-400">
              Across all 10 video types
            </div>
          </div>
        </div>

      </div>

      {/* ─── Visual Graphics & Diagrams Grid ──────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* Diagram 1: 7-Day Signups & Renders Growth (Left 7 Cols) */}
        <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Daily Signups &amp; Video Renders</h3>
                <p className="text-xs text-zinc-400">Last 7 days activity breakdown</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#FF6D00]" /> Signups
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Renders
                </span>
              </div>
            </div>

            {/* SVG Visual Dual-Bar Diagram */}
            <div className="mt-8 h-48 w-full flex items-end justify-between gap-3 px-2 pt-6 border-b border-white/10">
              {trends.dailySignupActivity?.map((item: any, i: number) => {
                const signupH = Math.max(8, Math.round((item.signups / maxDailySignup) * 130));
                const renderH = Math.max(8, Math.round((item.renders / maxDailyRender) * 130));

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-36">
                      {/* Signups Bar */}
                      <div
                        style={{ height: `${signupH}px` }}
                        className="w-full max-w-[14px] rounded-t-md bg-gradient-to-t from-[#FF6D00] to-[#FFA726] shadow-sm transition-all group-hover:brightness-125 relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#FFA726] bg-black/80 px-1 rounded transition-opacity">
                          {item.signups}
                        </span>
                      </div>
                      {/* Renders Bar */}
                      <div
                        style={{ height: `${renderH}px` }}
                        className="w-full max-w-[14px] rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm transition-all group-hover:brightness-125 relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-emerald-400 bg-black/80 px-1 rounded transition-opacity">
                          {item.renders}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 pt-2">
            <span>⚡ Automated Cloud Ingestion</span>
            <span className="text-[#FF9100] font-bold">AWS Lambda &amp; Groq Cloud</span>
          </div>
        </div>

        {/* Diagram 2: Video Types Popularity Breakdown (Right 5 Cols) */}
        <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-xl lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">10 Video Types Usage</h3>
                <p className="text-xs text-zinc-400">Which tools creators are generating with</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF9100]">{kpis.totalRendersCount} Total</span>
            </div>

            <div className="mt-5 space-y-3 max-h-60 overflow-y-auto pr-1">
              {trends.videoTypesDistribution?.map((vt: any) => (
                <div key={vt.mode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">{vt.label}</span>
                    <span className="font-mono text-zinc-400">
                      {vt.count} renders ({vt.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(3, vt.percentage)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FFA726]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Most Popular:</span>
            <span className="font-bold text-[#FFA726]">{trends.videoTypesDistribution?.[0]?.label || 'Auto Caption'}</span>
          </div>
        </div>

      </div>

      {/* ─── LIVE CREATOR ROSTER & USER EXPLORER ───────────────────── */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-6">
        
        {/* Table Controls & Filter Strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Registered Users &amp; Activity Log</h2>
            <p className="text-xs text-zinc-400">
              Users list with signup timestamps, location, video types used, and credits consumed.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, place..."
                className="pl-9 pr-4 py-2 rounded-full border border-white/15 bg-[#151E30] text-xs text-white placeholder-zinc-500 focus:border-[#FF6D00] focus:outline-none w-64"
              />
            </div>

            {/* Plan Filter Pills */}
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#151E30] p-1 text-xs">
              {['All', 'Paid', 'Free'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPlanFilter(f)}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    planFilter === f
                      ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151E30] text-zinc-400 uppercase tracking-wider font-bold border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Signup Date &amp; Time</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Video Types Used</th>
                <th className="px-4 py-3.5">Credits (Used / Left)</th>
                <th className="px-4 py-3.5">Plan Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0E1526]">
              {usersLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#FF9100] mb-2" />
                    Loading user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No users found matching your search filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#151E30]/70 transition-colors">
                    {/* User Name & Email */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{u.email}</div>
                    </td>

                    {/* Signup Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-zinc-200">{u.signupDateFormatted}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {new Date(u.signupDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#151E30] px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
                        <Globe size={11} className="text-[#FF9100]" />
                        {u.location}
                      </span>
                    </td>

                    {/* Video Types Used */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {u.videoTypes.map((vt, i) => (
                          <span
                            key={i}
                            className="rounded-md border border-white/10 bg-[#151E30] px-2 py-0.5 text-[10px] font-bold text-zinc-300"
                          >
                            {vt}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Credits Used / Left */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                      <div className="font-bold text-white">
                        {Math.round(u.creditsUsed)} used
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold">
                        {u.creditsRemaining} remaining
                      </div>
                    </td>

                    {/* Plan Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {u.isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-2.5 py-1 text-[10px] font-black text-black shadow-sm">
                          <Sparkles size={10} />
                          {u.plan}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#151E30] px-2.5 py-1 text-[10px] font-bold text-zinc-400">
                          Free Trial
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-[#151E30] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1C2840] hover:text-[#FFA726] transition"
                      >
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
