'use client';

import { useEffect, useState } from "react";
import { getAdminOverviewStats, getAdminUsers, type AdminUser } from "../actions";
import {
  Coins,
  ArrowUpRight,
  TrendingDown,
  Clock,
  User,
  Shield,
  Loader2,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function AdminCreditsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      const oStats = await getAdminOverviewStats();
      setStats(oStats);

      const uList = await getAdminUsers();
      setUsers(uList);
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
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
              Wallet Balances & Usage
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Credits Ledger Registry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Monitor credit balances, track generation consumption fees, and audit manual adjustments logs.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Ledgers</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Recompiling credit balances...
          </p>
        </div>
      ) : (
        <>
          {/* Key metrics cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <CreditMetric
              title="Active Wallet Reserves"
              value={stats?.kpis?.totalCreditsRemaining || 0}
              desc="Units circulating in creator accounts"
              icon={Coins}
              color="text-amber-600 bg-amber-50 border-amber-200"
            />
            <CreditMetric
              title="Credits Consumed"
              value={stats?.kpis?.totalCreditsUsed || 0}
              desc="Spent during video render jobs"
              icon={TrendingDown}
              color="text-[#1a73e8] bg-blue-50 border-blue-200"
            />
            <CreditMetric
              title="Manual Adjustments"
              value={users.filter(u => u.creditsRemaining > 1).length}
              desc="Accounts updated via admin overrides"
              icon={PlusCircle}
              color="text-[#34a853] bg-emerald-50 border-emerald-200"
            />
          </div>

          {/* Accounts Credits Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Shield className="text-[#1a73e8]" size={15} />
                <span>Wallets Balances Audit</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Subscription Tier</th>
                    <th className="px-6 py-3.5 text-center">Remaining Balance</th>
                    <th className="px-6 py-3.5 text-center">Videos Rendered</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{u.name || 'User'}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[11px]">
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-900">
                        {u.creditsRemaining}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-500">
                        {u.videosGenerated}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#34a853] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                          Synced
                        </span>
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

function CreditMetric({ title, value, desc, icon: Icon, color }: { title: string; value: any; desc: string; icon: any; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <h2 className="text-2xl font-black text-slate-900 font-mono">{value}</h2>
      <p className="text-[11px] text-slate-400">{desc}</p>
    </div>
  );
}
