'use client';

import React, { useEffect, useState } from "react";
import {
  getAdminUsers,
  adjustUserCredits,
  updateUserPlan,
  toggleUserSuspension,
  deleteUserAccount,
  type AdminUser
} from "../actions";
import {
  Search,
  Plus,
  Minus,
  Shield,
  ShieldAlert,
  Trash2,
  Coins,
  CreditCard,
  User,
  ExternalLink,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Globe,
  Sparkles,
  Calendar,
  Film
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");

  // Credit adjustment states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(5);
  const [creditReason, setCreditReason] = useState("Manual grant by support admin");
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  // Plan modification states
  const [selectedPlanUser, setSelectedPlanUser] = useState<AdminUser | null>(null);
  const [targetPlan, setTargetPlan] = useState("pro");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Actions loading indicator states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await getAdminUsers(search, planFilter);
      setUsers(res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load accounts database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, planFilter]);

  async function handleAdjustCredits(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setActionLoading(`credit-${selectedUser.id}`);
      const res = await adjustUserCredits(selectedUser.id, creditAmount, creditReason);
      toast.success(`Allocated ${creditAmount} credits to ${selectedUser.email}. New total: ${res.nextAmount}`);
      setIsCreditModalOpen(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.message || "Credits transaction failed.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdatePlan(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlanUser) return;
    const planName = targetPlan === "business" ? "Business Enterprise" : targetPlan === "pro" ? "Pro Creator" : "Free Trial";
    try {
      setActionLoading(`plan-${selectedPlanUser.id}`);
      await updateUserPlan(selectedPlanUser.id, targetPlan, planName);
      toast.success(`Upgraded ${selectedPlanUser.email} to ${planName}.`);
      setIsPlanModalOpen(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.message || "Plan modification failed.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleSuspension(user: AdminUser) {
    if (!confirm(`Are you sure you want to ${user.status === "active" ? "SUSPEND" : "REACTIVATE"} ${user.email}?`)) {
      return;
    }
    try {
      setActionLoading(`suspend-${user.id}`);
      await toggleUserSuspension(user.id, user.status);
      toast.success(`${user.email} is now ${user.status === "active" ? "suspended" : "active"}.`);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.message || "Suspension change failed.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    if (!confirm(`CAUTION: Are you absolutely sure you want to PERMANENTLY DELETE user account ${user.email}? This action is destructive and cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(`delete-${user.id}`);
      await deleteUserAccount(user.id);
      toast.success(`Permanently deleted ${user.email}.`);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.message || "Deletion failed.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6 pb-16 text-zinc-100">
      {/* Header Banner */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6D00] shadow-[0_0_8px_#FF6D00] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF9100]">
              Identity &amp; Access Directory
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            User Accounts &amp; Activity
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Inspect signup dates, locations, video tools used, credit consumption, and subscription status.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/15 bg-[#151E30] text-xs font-bold text-white hover:bg-[#1C2840] hover:text-[#FFA726] transition shadow-md active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Control Filter Bar */}
      <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
          <input
            type="text"
            placeholder="Search name, email, place, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151E30] border border-white/15 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF6D00] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-zinc-400" />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full sm:w-48 bg-[#151E30] border border-white/15 rounded-full px-4 py-2 text-xs font-bold text-zinc-200 focus:border-[#FF6D00] focus:outline-none"
          >
            <option value="All">All Plans</option>
            <option value="Paid">Paid Users Only</option>
            <option value="Free">Free Trial Only</option>
            <option value="Pro Creator">Pro Creator</option>
            <option value="Business Enterprise">Business Enterprise</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#FF9100] mx-auto" />
            <p className="text-xs font-black text-zinc-400 uppercase tracking-wider">
              Querying Accounts Database...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <User className="text-zinc-600 mx-auto" size={40} />
            <h3 className="text-sm font-bold text-zinc-300">No accounts found</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              No matching user profiles found in the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151E30] text-zinc-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Signup Date &amp; Time</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Video Types Used</th>
                  <th className="px-5 py-3.5 text-center">Credits (Used / Left)</th>
                  <th className="px-5 py-3.5">Plan Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#0E1526]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#151E30]/70 transition-colors group">
                    {/* User Profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FF6D00] to-[#FFA726] flex items-center justify-center text-black font-black text-xs uppercase shadow-sm">
                          {user.name ? user.name.slice(0, 2) : 'US'}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                            <span>{user.name || 'Anonymous User'}</span>
                            <span className="text-[10px] text-zinc-500 font-mono max-w-[100px] truncate">
                              ({user.id.slice(0, 8)}...)
                            </span>
                          </p>
                          <p className="text-[11px] text-zinc-400 leading-none font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Signup Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-zinc-200">{user.signupDateFormatted}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {new Date(user.signupDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#151E30] px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
                        <Globe size={11} className="text-[#FF9100]" />
                        {user.location}
                      </span>
                    </td>

                    {/* Video Types */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {user.videoTypes.map((vt, i) => (
                          <span
                            key={i}
                            className="rounded-md border border-white/10 bg-[#151E30] px-2 py-0.5 text-[10px] font-bold text-zinc-300"
                          >
                            {vt}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Credits */}
                    <td className="px-5 py-4 text-center font-mono whitespace-nowrap">
                      <div className="font-bold text-white">{Math.round(user.creditsUsed)} used</div>
                      <div className="text-[11px] text-emerald-400 font-bold">{user.creditsRemaining} left</div>
                    </td>

                    {/* Plan Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {user.isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-2.5 py-1 text-[10px] font-black text-black shadow-sm">
                          <Sparkles size={10} />
                          {user.plan}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#151E30] px-2.5 py-1 text-[10px] font-bold text-zinc-400">
                          Free Trial
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-2 rounded-xl border border-white/10 bg-[#151E30] hover:bg-[#1C2840] hover:text-[#FFA726] text-zinc-300 transition"
                          title="Inspect Profile"
                        >
                          <Eye size={13} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsCreditModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 text-[#FFA726] transition"
                          title="Allocate Credits"
                        >
                          <Coins size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlanUser(user);
                            setIsPlanModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF9100] transition"
                          title="Change Plan"
                        >
                          <CreditCard size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleSuspension(user)}
                          className="p-2 rounded-xl border border-white/10 bg-[#151E30] hover:bg-[#1C2840] text-zinc-300 transition"
                          title={user.status === "active" ? "Suspend Account" : "Reactivate Account"}
                        >
                          {user.status === "active" ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 rounded-xl border border-red-500/30 bg-red-950/30 hover:bg-red-900/40 text-red-400 transition"
                          title="Delete Account"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit Modal */}
      {isCreditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0E1526] border border-white/15 rounded-[28px] p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <h3 className="text-base font-black text-white">Adjust Credits Balance</h3>
            <p className="text-xs text-zinc-400">
              Allocating credits directly to <span className="font-bold text-[#FFA726]">{selectedUser.email}</span>
            </p>
            <form onSubmit={handleAdjustCredits} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Credit Amount (positive or negative)</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full bg-[#151E30] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#FF6D00] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="w-full bg-[#151E30] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6D00] focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/15 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === `credit-${selectedUser.id}`}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black text-xs font-black shadow-md hover:brightness-110"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {isPlanModalOpen && selectedPlanUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0E1526] border border-white/15 rounded-[28px] p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <h3 className="text-base font-black text-white">Modify User Subscription</h3>
            <p className="text-xs text-zinc-400">
              Upgrading plan for <span className="font-bold text-[#FFA726]">{selectedPlanUser.email}</span>
            </p>
            <form onSubmit={handleUpdatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Target Plan Tier</label>
                <select
                  value={targetPlan}
                  onChange={(e) => setTargetPlan(e.target.value)}
                  className="w-full bg-[#151E30] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#FF6D00] focus:outline-none"
                >
                  <option value="free">Free Trial</option>
                  <option value="pro">Pro Creator (Paid)</option>
                  <option value="business">Business Enterprise (Paid)</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/15 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === `plan-${selectedPlanUser.id}`}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black text-xs font-black shadow-md hover:brightness-110"
                >
                  Update Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
