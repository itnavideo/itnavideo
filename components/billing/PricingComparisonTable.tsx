"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Film,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Video,
  Layers,
  Flame,
  Award,
  Crown,
  Info,
} from "lucide-react";

export interface PricingComparisonTableProps {
  currency?: "USD" | "INR";
  billingCycle?: "monthly" | "annual";
  onSelectPlan?: (planId: string) => void;
  loadingPlan?: string | null;
}

type FeatureStatus = string | boolean;

interface MatrixRow {
  name: string;
  tooltip?: string;
  free: FeatureStatus;
  basic: FeatureStatus;
  growth: FeatureStatus;
  pro: FeatureStatus;
  highlight?: boolean;
}

interface MatrixCategory {
  title: string;
  badge?: string;
  description: string;
  rows: MatrixRow[];
}

export function PricingComparisonTable({
  currency: initialCurrency = "INR",
  billingCycle = "monthly",
  onSelectPlan,
  loadingPlan,
}: PricingComparisonTableProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState<"USD" | "INR">(initialCurrency);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Calcutta") || tz.includes("Kolkata") || tz.includes("Asia/Colombo")) {
        setCurrency("INR");
      } else {
        setCurrency("USD");
      }
    } catch {
      setCurrency("USD");
    }
  }, []);

  const handlePlanClick = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
      return;
    }
    if (planId === "free") {
      router.push("/signup");
      return;
    }
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/pricing");
    }
  };

  const toggleCategory = (title: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isAnnual = billingCycle === "annual";

  // Category & Feature Matrix Definitions
  const categories: MatrixCategory[] = [
    {
      title: "Video Output & Duration Allowances",
      badge: "Core Capacity",
      description: "How many videos and minutes you can create every month.",
      rows: [
        {
          name: "Monthly Credits Included",
          tooltip: "Credits reset every 30 days. Unused credits don't rollover, but you can top up anytime.",
          free: "1 Credit",
          basic: "25 Credits",
          growth: "85 Credits",
          pro: "200 Credits",
          highlight: true,
        },
        {
          name: "Real Video Output (Equivalent)",
          tooltip: "Actual video volume possible with your credits. Short-form (9:16) = 1 Cr. Long-form (16:9) = 1 Cr / Min.",
          free: "1 Short (90s)",
          basic: "25 Shorts & Reels (9:16)",
          growth: "35 Shorts + 10 Long (5m each)",
          pro: "60 Shorts + 14 Long (10m each)",
          highlight: true,
        },
        {
          name: "Max Duration (16:9 Widescreen)",
          tooltip: "Maximum video length allowed for a single 16:9 Faceless or Book Summary video.",
          free: "90s (Preview)",
          basic: "Shorts Only (9:16)",
          growth: "Up to 5 Mins (300s)",
          pro: "Up to 10 Mins (600s)",
        },
        {
          name: "Max Duration (9:16 Shorts & Reels)",
          tooltip: "Maximum length for vertical short-form videos across all short templates.",
          free: "Up to 90s",
          basic: "Up to 90s",
          growth: "Up to 90s",
          pro: "Up to 90s",
        },
        {
          name: "Long Video to Shorts Input Length",
          tooltip: "Maximum source podcast or YouTube video duration you can upload to extract viral clips.",
          free: false,
          basic: false,
          growth: "Up to 1 Hour",
          pro: "Up to 2 Hours",
        },
        {
          name: "Max File Upload Size",
          tooltip: "Maximum audio or video file size accepted for speech recognition & processing.",
          free: "25 MB",
          basic: "100 MB",
          growth: "250 MB",
          pro: "500 MB",
        },
        {
          name: "Cloud Render Storage Retention",
          tooltip: "How long your 1080p MP4 exports are kept safe and downloadable on AWS S3.",
          free: "24 Hours",
          basic: "48 Hours",
          growth: "7 Days",
          pro: "30 Days",
        },
      ],
    },
    {
      title: "All 11 Dedicated Video Studio Engines",
      badge: "Full Studio Suite",
      description: "Direct access to our purpose-built specialized video studios.",
      rows: [
        {
          name: "Faceless Video Generator (16:9)",
          tooltip: "AI scene director, automated stock B-roll matching, and kinetic subtitles for YouTube.",
          free: "Preview",
          basic: false,
          growth: "✓ (Up to 5 min)",
          pro: "✓ (Up to 10 min)",
          highlight: true,
        },
        {
          name: "Auto Caption & Subtitle Reel (9:16)",
          tooltip: "Word-synchronized kinetic subtitles with 100+ presets and highlight animations.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
        {
          name: "Long Video to Viral Clips",
          tooltip: "AI Hook Detector that finds the top viral retention hooks from long podcasts/lectures.",
          free: false,
          basic: false,
          growth: "✓ (2 Cr / clip)",
          pro: "✓ (2 Cr / clip)",
          highlight: true,
        },
        {
          name: "Book Summary Cinema Studio (16:9)",
          tooltip: "Cinematic chapter cards, key takeaways, and narrative visual pacing.",
          free: "Preview",
          basic: false,
          growth: "✓ (Up to 5 min)",
          pro: "✓ (Up to 10 min)",
        },
        {
          name: "Kinetic Typography Studio (9:16)",
          tooltip: "Word-by-word motion typography with 11 custom motion presets.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
        {
          name: "Whiteboard & Stickman Explainer (9:16)",
          tooltip: "Animated whiteboard hand drawing, stickman characters, and educational diagrams.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
        {
          name: "Image to Video AI (16:9)",
          tooltip: "Convert photos and story narration into 16:9 parallax motion video.",
          free: "Preview",
          basic: false,
          growth: "✓ (Up to 5 min)",
          pro: "✓ (Up to 10 min)",
        },
        {
          name: "YouTube Subtitles Burner (16:9)",
          tooltip: "Burn-in styled subtitles with custom safe-zones and scrubber bar.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
        {
          name: "Long Video Promo Teaser (9:16)",
          tooltip: "3D floating thumbnail and video teaser hook for promoting long videos on Shorts.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
        {
          name: "Compare Explainer Studio (9:16)",
          tooltip: "Split-screen comparisons with animated VS badges and side-by-side spec cards.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
        {
          name: "AI Studio Audio Cleaner",
          tooltip: "Removes silence, detects retakes/mistakes, and applies professional broadcast mastering.",
          free: false,
          basic: false,
          growth: true,
          pro: true,
          highlight: true,
        },
      ],
    },
    {
      title: "Cloud Engine, Export Quality & Rendering",
      badge: "Performance",
      description: "Video export quality, rendering speed, and cloud infrastructure.",
      rows: [
        {
          name: "Export Quality & Resolution",
          tooltip: "All videos render in crisp Full High Definition at 30 frames per second.",
          free: "1080p Full HD",
          basic: "1080p Full HD",
          growth: "1080p Full HD",
          pro: "1080p Full HD",
        },
        {
          name: "Zero Watermark",
          tooltip: "100% clean video exports with no branding or watermark on all paid plans.",
          free: false,
          basic: true,
          growth: true,
          pro: true,
          highlight: true,
        },
        {
          name: "Cloud Render Pipeline",
          tooltip: "Distributed AWS Lambda rendering cluster — zero battery or CPU strain on your laptop.",
          free: "AWS Lambda Cloud",
          basic: "AWS Lambda Cloud",
          growth: "AWS Lambda Cloud",
          pro: "AWS Lambda Cloud",
        },
        {
          name: "Speech-to-Text Transcription",
          tooltip: "Ultra-fast millisecond-accurate Groq Whisper transcription with Google Gemini fallback.",
          free: "Groq Whisper",
          basic: "Groq Whisper",
          growth: "Groq Whisper",
          pro: "Groq Whisper",
        },
        {
          name: "Cloud Queue Priority",
          tooltip: "Growth and Pro users get fast-lane priority in high-traffic rendering spikes.",
          free: "Standard Queue",
          basic: "Standard Queue",
          growth: "⚡ Priority Fast-Lane",
          pro: "🚀 Turbo Agency Lane",
          highlight: true,
        },
        {
          name: "Auto Refund on Render Failure",
          tooltip: "If a cloud render fails due to an unexpected system error, credits are instantly refunded.",
          free: true,
          basic: true,
          growth: true,
          pro: true,
        },
      ],
    },
    {
      title: "Commercial Licensing & Creator Support",
      badge: "Rights & Help",
      description: "Monetization permissions, team usage, and dedicated customer support.",
      rows: [
        {
          name: "Commercial Monetization Rights",
          tooltip: "Full monetization rights for YouTube AdSense, Instagram sponsorships, and TikTok Creator Rewards.",
          free: "Personal Use",
          basic: "✓ Full Commercial",
          growth: "✓ Full Commercial",
          pro: "✓ Client & Agency Work",
        },
        {
          name: "Number of Channels Allowed",
          tooltip: "How many YouTube, Instagram, or TikTok channels you can create content for.",
          free: "1 Channel",
          basic: "Unlimited",
          growth: "Unlimited",
          pro: "Unlimited",
        },
        {
          name: "Customer Support Level",
          tooltip: "Response time and priority of assistance from our creator engineering team.",
          free: "Community Help",
          basic: "Email Support (24h)",
          growth: "Priority Email (6h)",
          pro: "VIP WhatsApp & Founder",
          highlight: true,
        },
      ],
    },
  ];

  // Pricing summary cards for the table header
  const planHeaders = [
    {
      id: "free",
      name: "Free Trial",
      price: currency === "USD" ? "$0" : "₹0",
      period: "forever",
      credits: "1 Credit",
      cta: "Try Free",
      isPopular: false,
    },
    {
      id: "starter",
      name: "Basic (Shorts Only)",
      price: isAnnual
        ? currency === "USD" ? "$7" : "₹399"
        : currency === "USD" ? "$9" : "₹499",
      period: isAnnual ? "/mo (annual)" : "/month",
      credits: "25 Credits",
      cta: "Choose Basic",
      isPopular: false,
    },
    {
      id: "growth",
      name: "Growth (Shorts + Long)",
      price: isAnnual
        ? currency === "USD" ? "$15" : "₹799"
        : currency === "USD" ? "$19" : "₹999",
      period: isAnnual ? "/mo (annual)" : "/month",
      credits: "85 Credits",
      cta: "Choose Growth",
      isPopular: true,
    },
    {
      id: "pro",
      name: "Pro Agency",
      price: isAnnual
        ? currency === "USD" ? "$31" : "₹1,599"
        : currency === "USD" ? "$39" : "₹1,999",
      period: isAnnual ? "/mo (annual)" : "/month",
      credits: "200 Credits",
      cta: "Choose Pro",
      isPopular: false,
    },
  ];

  const renderCellContent = (val: FeatureStatus, isHighlight = false) => {
    if (typeof val === "boolean") {
      return val ? (
        <div className="flex items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <Check size={14} strokeWidth={2.5} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-300">
            <X size={12} strokeWidth={2} />
          </div>
        </div>
      );
    }

    return (
      <span
        className={`inline-block text-center text-xs font-bold ${
          isHighlight ? "text-slate-900 font-extrabold" : "text-slate-700"
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-700">
          <Sparkles size={14} className="text-[#FF5722]" />
          <span>SIDE-BY-SIDE FEATURE MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-sans">
          Compare All{" "}
          <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
            Plan Features
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Detailed feature-by-feature breakdown so you can choose the exact plan that matches your monthly video volume.
        </p>
      </div>

      {/* Comparison Matrix Table Container */}
      <div className="overflow-x-auto rounded-[32px] border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
        <table className="w-full min-w-[760px] border-collapse text-left">
          {/* Table Header: Sticky Plans Bar */}
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-sm">
              <th className="w-[32%] p-5 sm:p-6 text-slate-900 align-bottom">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Feature / Capability
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">Select your production scale</p>
              </th>

              {planHeaders.map((plan) => (
                <th
                  key={plan.id}
                  className={`w-[17%] p-4 sm:p-5 text-center align-bottom transition-colors ${
                    plan.isPopular
                      ? "bg-gradient-to-b from-orange-50/70 to-orange-50/20 border-x-2 border-t-2 border-[#FF5722]/30"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {plan.isPopular && (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                        ⭐ Most Popular
                      </span>
                    )}
                    <span className="text-base font-black text-slate-900">{plan.name}</span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-[11px] font-semibold text-slate-500">{plan.period}</span>
                    </div>
                    <span className="mt-1 text-[11px] font-bold text-orange-600">
                      {plan.credits}
                    </span>

                    {/* Action button */}
                    <button
                      type="button"
                      disabled={Boolean(loadingPlan)}
                      onClick={() => handlePlanClick(plan.id)}
                      className={`mt-3 w-full rounded-xl py-2 px-3 text-xs font-black transition cursor-pointer active:scale-95 ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/25 hover:brightness-110"
                          : plan.id === "free"
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border border-slate-300 bg-white text-slate-800 hover:border-orange-500/50 hover:bg-orange-50/50"
                      }`}
                    >
                      {loadingPlan === plan.id ? "Loading..." : plan.cta}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body with Categorized Sections */}
          <tbody>
            {categories.map((category) => {
              const isCollapsed = collapsedCategories[category.title];
              return (
                <React.Fragment key={category.title}>
                  {/* Category Header Row */}
                  <tr
                    onClick={() => toggleCategory(category.title)}
                    className="border-t-2 border-b border-slate-200/90 bg-slate-100/70 hover:bg-slate-100 cursor-pointer transition select-none"
                  >
                    <td colSpan={5} className="py-3 px-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-700 border border-orange-500/20">
                            {category.badge || "Features"}
                          </span>
                          <span className="text-sm font-black text-slate-900 font-sans">
                            {category.title}
                          </span>
                          <span className="hidden sm:inline text-xs text-slate-500 font-normal">
                            — {category.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
                          <span className="text-xs font-semibold">{isCollapsed ? "Expand" : "Collapse"}</span>
                          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Category Rows */}
                  {!isCollapsed &&
                    category.rows.map((row, idx) => (
                      <tr
                        key={row.name}
                        className={`border-b border-slate-100 transition-colors hover:bg-slate-50/60 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        }`}
                      >
                        {/* Feature Name & Tooltip */}
                        <td className="p-4 sm:p-5 text-slate-900">
                          <div className="flex items-center gap-1.5 group">
                            <span
                              className={`text-xs sm:text-sm font-bold ${
                                row.highlight ? "text-slate-900 font-extrabold" : "text-slate-700"
                              }`}
                            >
                              {row.name}
                            </span>
                            {row.tooltip && (
                              <div className="relative inline-block" title={row.tooltip}>
                                <Info
                                  size={13}
                                  className="text-slate-400 hover:text-orange-600 cursor-help transition-colors"
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Free Plan */}
                        <td className="p-4 text-center">{renderCellContent(row.free, row.highlight)}</td>

                        {/* Basic Plan */}
                        <td className="p-4 text-center">{renderCellContent(row.basic, row.highlight)}</td>

                        {/* Growth Plan (Highlighted Column) */}
                        <td className="p-4 text-center bg-orange-50/20 border-x border-[#FF5722]/20">
                          {renderCellContent(row.growth, row.highlight)}
                        </td>

                        {/* Pro Agency Plan */}
                        <td className="p-4 text-center">{renderCellContent(row.pro, row.highlight)}</td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Table Footer: Sticky Action Buttons */}
          <tfoot>
            <tr className="border-t-2 border-slate-200/90 bg-slate-50/90">
              <td className="p-5 text-slate-700">
                <span className="text-xs font-black uppercase text-slate-500">Ready to begin?</span>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Instant credit activation on signup</p>
              </td>
              {planHeaders.map((plan) => (
                <td
                  key={`foot-${plan.id}`}
                  className={`p-4 text-center ${
                    plan.isPopular ? "bg-orange-50/40 border-x border-[#FF5722]/20" : ""
                  }`}
                >
                  <button
                    type="button"
                    disabled={Boolean(loadingPlan)}
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full rounded-xl py-2 px-3 text-xs font-black transition cursor-pointer active:scale-95 ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/25 hover:brightness-110"
                        : plan.id === "free"
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "border border-slate-300 bg-white text-slate-800 hover:border-orange-500/50 hover:bg-orange-50/50"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Reassurance Footnote */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-[#FAFAFA] p-4 sm:p-5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#FF5722]" />
          <span className="font-bold text-slate-800">100% Risk-Free Guarantee:</span>
          <span>Failed cloud renders automatically refund your credits instantly.</span>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <span>Need custom API volume?</span>
          <Link href="/contact" className="text-orange-600 hover:text-orange-700 underline font-bold">
            Contact Sales &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PricingComparisonTable;
