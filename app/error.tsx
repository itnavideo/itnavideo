'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [reloading, setReloading] = useState(false);
  const msg = String(error?.message || '').toLowerCase();
  const isDeploymentSkew =
    msg.includes('server action') ||
    msg.includes('older or newer deployment') ||
    msg.includes('chunkloaderror') ||
    msg.includes('loading chunk') ||
    msg.includes('dynamically imported module') ||
    msg.includes('failed to fetch');

  useEffect(() => {
    if (isDeploymentSkew && typeof window !== 'undefined') {
      const hasAutoReloaded = sessionStorage.getItem('itnavideo_auto_reloaded_skew');
      if (!hasAutoReloaded) {
        sessionStorage.setItem('itnavideo_auto_reloaded_skew', 'true');
        setReloading(true);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    }
  }, [isDeploymentSkew]);

  const handleManualReload = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('itnavideo_auto_reloaded_skew');
      window.location.reload();
    } else {
      reset();
    }
  };

  if (isDeploymentSkew) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
          {reloading ? 'Updating Application...' : 'Application Update Available'}
        </h2>
        <p className="text-sm text-zinc-400 mb-6 max-w-md leading-relaxed">
          {reloading
            ? 'Loading the latest version with new enhancements...'
            : 'A new version of Itnavideo was just deployed. Please reload the page to continue seamlessly.'}
        </p>
        <button
          onClick={handleManualReload}
          disabled={reloading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] hover:from-orange-600 hover:to-amber-600 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={reloading ? 'animate-spin' : ''} />
          <span>{reloading ? 'Refreshing...' : 'Reload Page'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertTriangle size={28} />
      </div>
      <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-400 mb-6 max-w-md leading-relaxed">
        {error?.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-bold text-zinc-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
