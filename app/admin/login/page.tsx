'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/AdminContext';
import BrandLogo from '@/components/brand/BrandLogo';
import Link from 'next/link';
import { Loader2, ShieldCheck, KeyRound, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username);

      if (success) {
        toast.success("Identity verified. Welcome to Itnavideo Admin Workspace.");
        router.push('/admin/dashboard');
      } else {
        toast.error("Invalid credentials. Access denied.");
      }
    } catch {
      toast.error("Security system error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen text-slate-800 flex items-center justify-center px-4 sm:px-6 relative font-sans">
      <div className="w-full max-w-md relative space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <BrandLogo size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-[#1a73e8] shadow-xs">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-xs text-slate-500">Enter your founder security key to access the workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                Founder Security Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#1a73e8] focus:bg-white focus:outline-none transition font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a73e8] hover:bg-[#1967d2] text-white disabled:opacity-50 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Authenticate & Enter Console'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#34a853] animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-500">Security Gate: Active & Encrypted</span>
          </div>
        </div>
      </div>
    </main>
  );
}
