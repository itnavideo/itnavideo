'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Lock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export interface FeaturePaywallProps {
  /** Display name of the locked feature, e.g. "Faceless Shorts". */
  featureName: string;
  /** Optional short blurb describing what the feature does. */
  description?: string;
  className?: string;
}

/**
 * Upgrade screen shown to free-tier users who try to access a paid-only video type.
 * Renders a clean locked-state card with a CTA to /pricing. Reusable across every
 * paid feature's page client (see lib/billing/freeTierAccess.ts).
 */
export function FeaturePaywall({ featureName, description, className = '' }: FeaturePaywallProps) {
  const perks = [
    'Unlimited HD 1080p cloud renders',
    'All AI video types unlocked',
    'No Itnavideo watermark on exports',
    'Priority AWS Lambda render queue',
  ];

  return (
    <div className={`min-h-[70vh] flex items-center justify-center p-6 ${className}`}>
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 mb-4">
            <Lock size={26} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {featureName} is a Pro feature
          </h2>
          <p className="mt-2 text-sm text-white/85 leading-relaxed">
            {description ||
              `Rendering and AI scene planning cost real compute — ${featureName} is available on paid plans. Free accounts can use Auto Captions and the YouTube Subtitles Generator.`}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-orange-500" />
            <span className="text-sm font-black text-slate-900">Upgrade to unlock</span>
          </div>
          <ul className="space-y-2.5 mb-7">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5">
                <CheckCircle2 size={17} className="text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-600 leading-snug">{perk}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            className="group flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-black shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            View Plans &amp; Upgrade
            <ArrowUpRight size={17} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <p className="mt-4 text-center text-xs text-slate-400">
            Already paying? Re-check your subscription in{' '}
            <Link href="/dashboard/settings" className="font-semibold text-slate-600 hover:text-orange-600">
              Settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeaturePaywall;
