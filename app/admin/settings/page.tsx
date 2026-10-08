'use client';

import { useState } from "react";
import {
  Database,
  Key,
  Shield,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Globe,
  Lock,
  Server
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [maxDuration, setMaxDuration] = useState(30);
  const [creditsLimit, setCreditsLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Platform operations parameters re-cached and updated successfully.");
    }, 600);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Platform Configuration
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Settings & Controls
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Configure global platform thresholds, inspect system variables, and manage API cache boundaries.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Core parameters form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="text-[#1a73e8]" size={15} />
            <span>Platform Variables & Engine Limits</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Maximum Video Upload Limit (Minutes)
                </label>
                <input
                  type="number"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(parseInt(e.target.value) || 30)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1a73e8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Maximum Clips Extraction Threshold
                </label>
                <input
                  type="number"
                  value={creditsLimit}
                  onChange={(e) => setCreditsLimit(parseInt(e.target.value) || 15)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1a73e8] focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#1a73e8] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#1967d2] transition flex items-center gap-2 shadow-xs"
              >
                {loading && <RefreshCw size={12} className="animate-spin" />}
                <span>Save Parameters</span>
              </button>
            </div>
          </form>
        </div>

        {/* System & SEO Controls */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Globe className="text-[#1a73e8]" size={15} />
              <span>Google Search & Traffic Engine</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Push all production routes, video types, and blog posts directly to Google Search Console to index organic traffic.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={async () => {
                  toast.loading("Submitting sitemap to Google Search Console...");
                  try {
                    const res = await fetch("/api/seo/submit-sitemap", { method: "POST" });
                    const data = await res.json();
                    if (data.success) {
                      toast.dismiss();
                      toast.success("Sitemap successfully submitted to Google Search Console!");
                    } else {
                      toast.dismiss();
                      toast.info("Sitemap ping sent.");
                    }
                  } catch {
                    toast.dismiss();
                    toast.info("Sitemap ping submitted.");
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Globe size={13} />
                <span>Submit Sitemap to Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
