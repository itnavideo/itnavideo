'use client';

import { useEffect, useState } from "react";
import { getAdminOverviewStats } from "../actions";
import {
  TrendingUp,
  RefreshCw,
  Loader2,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Calendar,
  Users
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

  const totalRevenue = stats?.kpis?.totalRevenue || 0;
  const revenueToday = stats?.kpis?.revenueToday || 0;
  const revenueThisMonth = stats?.kpis?.revenueThisMonth || totalRevenue;
  const paidSubscribers = stats?.kpis?.paidUsersCount || 0;
  const recentPayments = stats?.recentPayments || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6D00]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF6D00]">
              Revenue & Financials
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Revenue Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Real successful payment settlements, active subscriptions, and billing ledgers.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-[#FF6D00]' : 'text-slate-500'} />
          <span>Sync Revenue Data</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#FF6D00] mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fetching Revenue Ledger...
          </p>
        </div>
      ) : (
        <>
          {/* Top 4 Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* 1. Total Revenue to Date */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Revenue (To Date)</span>
                <div className="h-8 w-8 rounded-xl bg-[#FF6D00]/10 border border-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00]">
                  <TrendingUp size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h2>
              <p className="text-[11px] font-semibold text-emerald-600">
                Verified settlements
              </p>
            </div>

            {/* 2. Revenue Today */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Revenue Generated (Today)</span>
                <div className="h-8 w-8 rounded-xl bg-[#FF6D00]/10 border border-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00]">
                  <DollarSign size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                ₹{revenueToday.toLocaleString('en-IN')}
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Today&apos;s active transactions
              </p>
            </div>

            {/* 3. Revenue This Month */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Revenue (This Month)</span>
                <div className="h-8 w-8 rounded-xl bg-[#FF6D00]/10 border border-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00]">
                  <Calendar size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                ₹{revenueThisMonth.toLocaleString('en-IN')}
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Current billing month
              </p>
            </div>

            {/* 4. Active Paid Subscribers */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Active Paid Subscribers</span>
                <div className="h-8 w-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Users size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {paidSubscribers.toLocaleString('en-US')}
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Active recurring accounts
              </p>
            </div>

          </div>

          {/* Recent Payments Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="text-[#FF6D00]" size={16} />
                <span>Audited Payment Records</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              {recentPayments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-medium">
                  No custom payment settlements recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Transaction ID</th>
                      <th className="px-6 py-3.5">Payer Email</th>
                      <th className="px-6 py-3.5">Plan Tier</th>
                      <th className="px-6 py-3.5 text-right">Settlement Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentPayments.map((p: any, idx: number) => (
                      <tr key={p.id || idx} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                          {p.id || `tx_${idx + 1}`}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {p.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FF6D00]/10 text-[#FF6D00] border border-[#FF6D00]/20 font-bold text-[10px] uppercase">
                            {p.planName || 'Pro Plan'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                          ₹{p.amount ? p.amount.toLocaleString('en-IN') : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
