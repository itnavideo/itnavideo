'use client';

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getAdminUsers, getAdminVideos, type AdminUser, type AdminVideo } from "../../actions";
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  Coins,
  History,
  Film,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Globe,
  Smartphone,
  MapPin,
  Laptop
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: userId } = use(params);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [userVideos, setUserVideos] = useState<AdminVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);

      const usersList = await getAdminUsers();
      const match = usersList.find(u => u.id === userId);

      if (!match) {
        throw new Error(`Account reference ${userId} could not be located in database.`);
      }

      setUser(match);

      const videosList = await getAdminVideos();
      const matchVideos = videosList.filter(v => v.userId === userId);
      setUserVideos(matchVideos);

    } catch (err: any) {
      setError(err?.message || "Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Compiling account credentials...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to directory</span>
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3 shadow-xs">
          <AlertTriangle className="text-[#ea4335] mx-auto" size={36} />
          <h3 className="text-sm font-bold text-slate-900">Account Not Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Users Directory</span>
        </Link>
        <button
          onClick={loadProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <RefreshCw size={13} />
          <span>Sync Profile</span>
        </button>
      </div>

      {/* Profile Header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8] font-black text-xl uppercase shadow-xs">
            {user.name ? user.name.slice(0, 2) : 'US'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{user.name || 'User'}</h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  user.status === "active"
                    ? "bg-emerald-50 text-[#34a853] border border-emerald-200"
                    : "bg-red-50 text-[#ea4335] border border-red-200"
                }`}
              >
                {user.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
            <p className="text-[10px] text-slate-400 font-mono">UID: {user.id}</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 space-y-1 sm:text-right font-mono">
          <p className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">Activity Times</p>
          <p>Joined: {new Date(user.signupDate).toLocaleDateString()}</p>
          <p>Last Active: {new Date(user.lastLogin).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Subscription details card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <CreditCard size={14} className="text-[#1a73e8]" />
            <span>Plan Entitlements</span>
          </h3>
          <div className="space-y-2 pt-1 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <span className="text-slate-500">Plan Tier</span>
              <span className="font-bold text-[#1a73e8] font-mono">{user.plan}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <span className="text-slate-500">Billing Cycle</span>
              <span className="font-semibold text-slate-800">Monthly</span>
            </div>
          </div>
        </div>

        {/* Credits Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Coins size={14} className="text-amber-500" />
            <span>Balance Reserves</span>
          </h3>
          <div className="space-y-2 pt-1 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <span className="text-slate-500">Remaining Balance</span>
              <span className="font-bold text-amber-600 font-mono">{user.creditsRemaining} credits</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <span className="text-slate-500">Credits Used</span>
              <span className="font-semibold text-slate-800 font-mono">{user.creditsUsed} credits</span>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <History size={14} className="text-[#34a853]" />
            <span>Login Audits</span>
          </h3>
          <div className="space-y-2 pt-1 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
              <Laptop size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 leading-none">Web Browser</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">103.240.231.14 (Vercel Proxy)</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 leading-none">India / Global</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">SSL Encrypted Session</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Generated list section */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Film size={15} className="text-[#1a73e8]" />
            <span>Render History ({userVideos.length} Exports)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Render ID</th>
                <th className="px-6 py-3.5">Template Mode</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5 text-right">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {userVideos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-sans">
                    No videos rendered yet by this user.
                  </td>
                </tr>
              ) : (
                userVideos.map((v) => (
                  <tr key={v.renderId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-slate-500">{v.renderId}</td>
                    <td className="px-6 py-4 font-sans">{v.mode}</td>
                    <td className="px-6 py-4 font-sans font-medium text-slate-900">{v.title}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{v.creditsUsed}</td>
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
