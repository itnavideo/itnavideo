'use client';

import { useEffect, useState } from "react";
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
  MoreVertical
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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Identity & Access Management
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Accounts Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Monitor registered creators, inspect credit balances, override subscriptions, and manage permissions.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Control Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search name, email, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full sm:w-48 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#1a73e8] focus:outline-none"
          >
            <option value="All">All Plans</option>
            <option value="Free Trial">Free Trial</option>
            <option value="Pro Creator">Pro Creator</option>
            <option value="Business Enterprise">Business Enterprise</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Querying Accounts Database...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <User className="text-slate-300 mx-auto" size={40} />
            <h3 className="text-sm font-bold text-slate-700">No accounts found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              No matching user profiles found in the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Account & User ID</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Plan Tier</th>
                  <th className="px-6 py-3.5 text-center">Remaining Credits</th>
                  <th className="px-6 py-3.5 text-center">Exports</th>
                  <th className="px-6 py-3.5 text-right">Overrides & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8] font-black text-xs uppercase shadow-xs">
                          {user.name ? user.name.slice(0, 2) : 'US'}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 leading-none">
                            <span>{user.name || 'Anonymous User'}</span>
                            <span className="text-[10px] text-slate-400 font-mono max-w-[120px] truncate">
                              ({user.id})
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 leading-none">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                          user.status === "active"
                            ? "bg-emerald-50 border-emerald-200 text-[#34a853]"
                            : "bg-red-50 border-red-200 text-[#ea4335]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "active" ? "bg-[#34a853]" : "bg-[#ea4335]"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs font-bold text-slate-900">
                      {user.creditsRemaining}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs text-slate-500">
                      {user.videosGenerated}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
                          title="Inspect Profile"
                        >
                          <Eye size={13} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsCreditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                          title="Allocate Credits"
                        >
                          <Coins size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlanUser(user);
                            setIsPlanModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] transition"
                          title="Change Plan"
                        >
                          <CreditCard size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleSuspension(user)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
                          title={user.status === "active" ? "Suspend Account" : "Reactivate Account"}
                        >
                          {user.status === "active" ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#ea4335] transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Adjust Credits Balance</h3>
            <p className="text-xs text-slate-500">
              Allocating credits directly to <span className="font-semibold text-slate-800">{selectedUser.email}</span>
            </p>
            <form onSubmit={handleAdjustCredits} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Credit Amount (positive or negative)</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1a73e8] text-white text-xs font-bold hover:bg-[#1967d2]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Override Subscription Plan</h3>
            <p className="text-xs text-slate-500">
              Target user: <span className="font-semibold text-slate-800">{selectedPlanUser.email}</span>
            </p>
            <form onSubmit={handleUpdatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Subscription Tier</label>
                <select
                  value={targetPlan}
                  onChange={(e) => setTargetPlan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="free">Free Trial</option>
                  <option value="pro">Pro Creator Plan</option>
                  <option value="business">Business Enterprise Plan</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1a73e8] text-white text-xs font-bold hover:bg-[#1967d2]"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
