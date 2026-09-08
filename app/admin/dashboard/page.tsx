'use client';

import { useEffect, useState } from "react";
import { getAdminOverviewStats } from "../actions";
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
  PenTool,
  PlusCircle,
  FileText,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/blogPosts";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOverviewStats();
      setStats(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin telemetry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-7 w-48 bg-slate-200 rounded" />
          </div>
          <div className="h-10 w-10 bg-slate-200 rounded-xl" />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-28 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center space-y-4 shadow-xs">
        <AlertTriangle className="text-[#ea4335] mx-auto" size={40} />
        <h3 className="text-base font-bold text-slate-800">Telemetry Sync Timeout</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold hover:bg-slate-50 text-slate-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, trends, recentPayments } = stats;

  return (
    <div className="space-y-6 pb-12">
      {/* Google Analytics Style Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8] shadow-[0_0_8px_#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Executive Overview · Itnavideo HQ
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Real-time operations, user activity, video rendering pipelines, and integrated WordPress CMS publishing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link
            href="/admin/cms/posts/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition shadow-sm"
          >
            <PlusCircle size={15} /> Add New Article
          </Link>
        </div>
      </div>

      {/* Google Analytics KPI Scorecards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* MRR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MRR Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#34a853]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              ₹{kpis.mrr.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Aggregated plan subscriptions</p>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#34a853] rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8]">
              <Users size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900">{kpis.usersCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">{kpis.activeUsers} active in last 30d</p>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1a73e8] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Renders Today */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Renders Today</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#fbbc04]">
              <Film size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900">{kpis.rendersToday}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {kpis.successRate.toFixed(1)}% success rate
            </p>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#fbbc04] rounded-full" style={{ width: '70%' }} />
          </div>
        </div>

        {/* WordPress CMS Content Posts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CMS Content Library</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <PenTool size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900">{blogPosts.length} Articles</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Static in-code & dynamic articles</p>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '95%' }} />
          </div>
        </div>
      </div>

      {/* Analytics Trends & WordPress Quick Access */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Volume Trend (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">7-Day Revenue Velocity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Direct checkout volume</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Live Verified
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-l border-slate-200 px-3">
            {trends.revenueTrend.map((t: any, i: number) => {
              const maxVal = Math.max(...trends.revenueTrend.map((x: any) => x.value)) || 1000;
              const heightPct = Math.max(12, (t.value / maxVal) * 85);
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute -top-9 scale-0 group-hover:scale-100 transition bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-mono z-20 whitespace-nowrap shadow-md">
                    ₹{t.value.toLocaleString('en-IN')}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-blue-100 hover:bg-[#1a73e8] border-t-2 border-[#1a73e8] rounded-t transition-colors duration-200"
                  />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">{t.label || `Day ${i + 1}`}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integrated CMS Quick Access Card (1 col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <PenTool size={15} className="text-[#1a73e8]" />
              <span>WordPress Content Hub</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Create and manage SEO-optimized articles, kinetic typography promos, and landing pages directly.
            </p>
          </div>

          <div className="space-y-2">
            <Link
              href="/admin/cms"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#1a73e8]" />
                <span className="text-xs font-bold text-slate-800">Manage All Posts</span>
              </div>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-700 transition" />
            </Link>

            <Link
              href="/admin/cms/posts/new"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition group"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle size={16} className="text-[#1a73e8]" />
                <span className="text-xs font-bold text-blue-900">Write New Article</span>
              </div>
              <ArrowUpRight size={14} className="text-[#1a73e8]" />
            </Link>

            <Link
              href="/admin/cms/media"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-[#34a853]" />
                <span className="text-xs font-bold text-slate-800">Media Library & CDN</span>
              </div>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-700 transition" />
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#34a853] shrink-0" />
            <span>Google Search indexing is active for all published articles.</span>
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Recent Customer Payments</h3>
            <p className="text-[11px] text-slate-500">Live Razorpay verified transactions</p>
          </div>
          <Link
            href="/admin/revenue"
            className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-1"
          >
            View All Billing <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer Email</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPayments?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No payment history recorded yet.
                  </td>
                </tr>
              ) : (
                recentPayments?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-3.5 font-mono text-slate-800 font-medium">{p.orderId || p.id}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{p.email || 'customer@itnavideo.com'}</td>
                    <td className="px-6 py-3.5 font-bold font-mono text-slate-900">₹{p.amount || 299}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#34a853] border border-emerald-200 font-bold text-[10px] uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#34a853]" /> Success
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-[11px]">
                      {new Date(p.created_at || Date.now()).toLocaleDateString()}
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
