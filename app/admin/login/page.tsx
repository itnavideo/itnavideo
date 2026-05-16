'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/AdminContext';
import BrandLogo from '@/components/brand/BrandLogo';
import Link from 'next/link';
import { Loader2, ShieldCheck, Lock, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast.success("Identity verified. Welcome back, Founder.");
        router.push('/admin/dashboard');
      } else {
        toast.error("Invalid credentials. Access denied.");
      }
    } catch (error) {
      toast.error("Security system error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="brand-surface min-h-screen text-white flex items-center justify-center px-6 relative overflow-hidden">

      <div className="w-full max-w-md relative">
        {/* Back Link */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <BrandLogo size="sm" />
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Exit Terminal</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-10 shadow-2xl">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-brand-mint/10 border border-brand-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-brand-mint" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Admin <span className="text-brand-mint">Access</span></h1>
            <p className="text-zinc-500 text-sm font-medium">Founder-only operations panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-mint transition-colors" size={18} />
              <input
                type="text"
                placeholder="Founder ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-12 py-4 focus:border-brand-mint focus:outline-none transition-all placeholder:text-zinc-700 font-medium"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-mint transition-colors" size={18} />
              <input
                type="password"
                placeholder="Private password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-12 py-4 focus:border-brand-mint focus:outline-none transition-all placeholder:text-zinc-700 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-mint text-black hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 py-4 rounded-lg font-black transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">System Status: Secure</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

