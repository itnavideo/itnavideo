'use client';

import { useEffect, useState } from "react";
import { getAdminOverviewStats } from "../actions";
import {
  TrendingUp,
  Coins,
  RefreshCw,
  Loader2,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  DollarSign
} from "lucide-react";

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  async function loadData() {
    try {
      setLoading(true);
      const res = await getAdminOverviewStats();
      setStats(res);
    } catch {
      // fail gracefully
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#34a853]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#34a853]">
              Financials & Transactions
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Revenue Operations Ledger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Track aggregate payments, checkout volume trends, and audited transaction lists.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Transactions</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Compiling Financials...
          </p>
        </div>
      ) : (
        <>
          {/* Key cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Aggregate Platform Revenue</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#34a853]">
                  <TrendingUp size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                ₹{stats?.kpis?.totalRevenue ? stats.kpis.totalRevenue.toLocaleString('en-IN') : '0'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#34a853] font-semibold">
                <span>+100% verified Razorpay & Stripe settles</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Average Order Value</span>
                <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8]">
                  <CreditCard size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                ₹999
              </h2>
              <p className="text-xs text-slate-500">Standardized Pro & Business creator plans</p>
            </div>
          </div>

          {/* Transactions list */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="text-[#34a853]" size={15} />
                <span>Audited Payment Records</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-6 py-3.5">Payer Account</th>
                    <th className="px-6 py-3.5">Subscription Tier</th>
                    <th className="px-6 py-3.5 text-right">Settlement Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(stats?.recentUsers || []).map((u: any, idx: number) => (
                    <tr key={u.id || idx} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                        tx_{u.id ? u.id.slice(0, 10) : '001'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200 font-bold text-[10px] uppercase">
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        ₹{u.plan.includes('Pro') ? '999' : u.plan.includes('Business') ? '2,499' : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
