'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Download, Sparkles, Clock, HelpCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { PLATFORM_MODE_CONFIG } from '@/lib/config/platformMode';

export interface DailyDownloadBadgeProps {
  className?: string;
  showTooltip?: boolean;
}

export function DailyDownloadBadge({
  className = '',
  showTooltip = true,
}: DailyDownloadBadgeProps) {
  const { user } = useAuth();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(PLATFORM_MODE_CONFIG.DAILY_FREE_DOWNLOAD_LIMIT);
  const [resetsIn, setResetsIn] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchQuota = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/downloads/check?userId=${encodeURIComponent(user.id || user.uid)}`);
      const data = await res.json();
      if (data && data.ok) {
        setRemaining(Number(data.remaining));
        setLimit(Number(data.limit) || 2);
        setResetsIn(data.resetsInFormatted || '');
      }
    } catch (err) {
      console.warn('Failed to fetch daily download quota:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchQuota();

    // Listen for custom event whenever a download is claimed anywhere in the app
    const handleDownloadClaimed = () => {
      fetchQuota();
    };

    window.addEventListener('download-claimed', handleDownloadClaimed);
    return () => {
      window.removeEventListener('download-claimed', handleDownloadClaimed);
    };
  }, [fetchQuota]);

  if (!PLATFORM_MODE_CONFIG.TEMPORARY_FREE_ACCESS) {
    return null;
  }

  const isExhausted = remaining === 0;
  const remainingDisplay = remaining !== null ? `${remaining}/${limit}` : `2/${limit}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-black transition-all cursor-pointer select-none ${
          isExhausted
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/15'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/15'
        } ${className}`}
        title="Click to view daily download policy and reset time"
      >
        <span className={`h-2 w-2 rounded-full ${isExhausted ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
        <span className="font-extrabold font-sans">
          Daily Free Downloads: <span className="font-mono">{remainingDisplay}</span> remaining
        </span>
        <HelpCircle size={13} className="text-slate-400 opacity-80" />
      </button>

      {/* Info Modal on Click */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                  <Download size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 font-sans">Daily Free Download Allowance</h4>
                  <p className="text-[11px] text-slate-500">2 Full HD 1080p Video Downloads Daily</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between font-bold">
                <span>Remaining Today:</span>
                <span className={`font-mono font-black ${isExhausted ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {remainingDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span>Next Allowance Reset:</span>
                <span className="font-mono text-slate-900">
                  {resetsIn ? `in ${resetsIn}` : '12:00 AM IST'} (Asia/Kolkata)
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
              <p>
                <strong>Unlimited Previews:</strong> You can generate, script, and preview as many videos as you want across all 15 studios completely free.
              </p>
              <p>
                <strong>Downloads:</strong> Each registered user can download 2 completed 1080p videos per day. Re-downloading the same video on the same day does not consume an extra download.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
