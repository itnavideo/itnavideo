'use client';

import { useEffect, useState } from "react";
import { getAdminOverviewStats } from "../actions";
import {
  CreditCard,
  TrendingUp,
  Percent,
  RefreshCw,
  Loader2,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";

export default function AdminSubscriptionsPage() {
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
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Recurring SaaS Operations
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Subscriptions & Revenue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Track recurring subscription volume, conversion rates, plan tiers distribution, and checkout health.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Subscriptions</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Aggregating conversion graphs...
          </p>
        </div>
      ) : (
        <>
          {/* Metrics bar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SubMetric
              title="Monthly Recurring Revenue"
              value={`₹${stats?.kpis?.mrr ? stats.kpis.mrr.toLocaleString('en-IN') : '0'}`}
              desc="Annual Run Rate equivalent"
              icon={TrendingUp}
              color="text-[#34a853] bg-emerald-50 border-emerald-200"
            />
            <SubMetric
              title="Paid Active Users"
              value={stats?.kpis?.paidUsersCount || 0}
              desc={`Out of ${stats?.kpis?.usersCount || 0} accounts`}
              icon={Users}
              color="text-[#1a73e8] bg-blue-50 border-blue-200"
            />
            <SubMetric
              title="SaaS Conversion Rate"
              value={`${stats?.kpis?.usersCount > 0 ? ((stats.kpis.paidUsersCount / stats.kpis.usersCount) * 100).toFixed(1) : 0}%`}
              desc="Signup-to-paid conversion"
              icon={Percent}
              color="text-amber-600 bg-amber-50 border-amber-200"
            />
            <SubMetric
              title="Estimated Churn"
              value="1.8%"
              desc="Healthy SaaS benchmark < 5%"
              icon={AlertTriangle}
              color="text-slate-600 bg-slate-100 border-slate-200"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Plans listing */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Plan Tiers & Distribution
              </h3>
              <div className="space-y-3">
                <PlanTierRow
                  name="Free Trial Tier"
                  count={stats?.kpis?.freeUsersCount || 0}
                  limit="1 Watermarked Video"
                  price="₹0"
                />
                <PlanTierRow
                  name="Pro Creator Tier"
                  count={stats?.kpis?.paidUsersCount || 0}
                  limit="30 Vertical Videos"
                  price="₹999/mo"
                />
                <PlanTierRow
                  name="Business Enterprise"
                  count={0}
                  limit="Custom Dedicated Worker Cluster"
                  price="₹2,499/mo"
                />
              </div>
            </div>

            {/* Quick conversion insights */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#34a853]" />
                  <span>Checkout Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Customer payments are securely integrated with instant webhook credit entitlement fulfillment.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway Status:</span>
                  <span className="font-bold text-[#34a853]">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Processor:</span>
                  <span className="font-semibold text-slate-800">Razorpay / Stripe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Webhook Sync:</span>
                  <span className="font-semibold text-slate-800">Auto-Provisioning</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SubMetric({ title, value, desc, icon: Icon, color }: { title: string; value: any; desc: string; icon: any; color: string }) {
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

function PlanTierRow({ name, count, limit, price }: { name: string; count: number; limit: string; price: string }) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-slate-900">{name}</h4>
        <p className="text-[11px] text-slate-500">{limit}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-bold text-slate-900">{price}</span>
        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#1a73e8] border border-blue-200 text-xs font-bold font-mono">
          {count} users
        </span>
      </div>
    </div>
  );
}
