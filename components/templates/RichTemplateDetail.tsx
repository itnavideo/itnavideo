'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DemoVideosShowcase, {
  AutoCaptionDemoSection,
  CompareExplainerDemoSection,
  TypographyDemoSection,
} from '@/components/landing/DemoVideosShowcase';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Download,
  Film,
  HelpCircle,
  LucideIcon,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface RichTemplateDetailProps {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  aspectRatio: '9:16' | '16:9' | 'Audio';
  previewImage: string;
  dashHref: string;
  features: Array<{ title: string; desc: string; iconName?: string }>;
  howItWorks: Array<{ step: string; title: string; desc: string }>;
  whoIsItFor: Array<{ role: string; desc: string }>;
  techSpecs: Array<{ label: string; value: string }>;
  faqs: Array<{ q: string; a: string }>;
  theme?: 'dark' | 'light';
}

export default function RichTemplateDetail({
  id,
  title,
  subtitle,
  badge,
  accentColor,
  aspectRatio,
  previewImage,
  dashHref,
  features,
  howItWorks,
  whoIsItFor,
  techSpecs,
  faqs,
  theme = 'dark',
}: RichTemplateDetailProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isLight = theme === 'light';

  // Dynamic Theme Styling Maps
  const mainBg = isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-white";
  const selectionBg = isLight ? "selection:bg-blue-100 selection:text-slate-900" : "selection:bg-cyan-500 selection:text-slate-950";
  const mainBorder = isLight ? "border-slate-200" : "border-white/10";
  const subtleBorder = isLight ? "border-slate-100" : "border-white/5";
  const altBg = isLight ? "bg-white" : "bg-slate-900/50";
  
  // Typography
  const headingText = isLight ? "text-slate-900 font-sans" : "text-white font-sans";
  const bodyText = isLight ? "text-slate-600 font-normal" : "text-zinc-300 font-normal";
  const labelText = isLight ? "text-slate-400" : "text-zinc-400";
  const brandText = isLight ? "text-blue-600" : "text-cyan-400";
  const subHeadingText = isLight ? "text-slate-800" : "text-white";
  const blockTitleText = isLight ? "text-slate-900" : "text-white";
  
  // Cards
  const specCardBg = isLight ? "bg-white shadow-xs border border-slate-200/80" : "bg-slate-900/80 backdrop-blur-xl border border-white/10";
  const stepCardBg = isLight ? "bg-white border border-slate-200/80 hover:border-blue-500/30 shadow-xs hover:shadow-md transition-all duration-300" : "border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-lg hover:border-cyan-400/40 transition duration-300";
  const featureCardBg = isLight ? "bg-white border border-slate-200/70 hover:border-blue-500/20 shadow-xs transition duration-200" : "border border-white/10 bg-slate-900/60 backdrop-blur-md hover:border-white/20 transition";
  const audienceCardBg = isLight ? "bg-white border border-slate-200 hover:border-blue-500/30 shadow-xs transition duration-200" : "border border-white/10 bg-slate-950 hover:border-cyan-400/30 transition";
  const faqCardBg = isLight ? "bg-white shadow-xs border border-slate-200 hover:border-blue-500/30" : "bg-slate-900/80 border border-white/10";
  const faqButtonText = isLight ? "text-slate-800 hover:text-blue-600" : "text-white hover:text-cyan-300";
  const stickyBarBg = isLight ? "bg-white/95 border-t border-slate-200" : "bg-slate-950/90 border-t border-cyan-500/30";

  return (
    <main className={`min-h-screen ${mainBg} ${selectionBg} pb-24`}>
      {/* Background Animated Gradient Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full blur-[140px]"
          style={{
            background: isLight
              ? "radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(6,182,212,0.04) 50%, transparent 80%)"
              : `radial-gradient(circle, ${accentColor}33 0%, rgba(6,182,212,0.15) 50%, transparent 80%)`
          }}
        />
      </div>

      {/* Hero Header Section */}
      <section className={`relative z-10 px-4 pt-28 pb-16 sm:px-6 sm:pt-32 border-b ${mainBorder}`}>
        <div className="mx-auto max-w-5xl text-center space-y-6">
          {/* Eyebrow Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black tracking-wider uppercase backdrop-blur-md shadow-xs"
            style={{
              border: `1px solid ${accentColor}55`,
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            <Sparkles size={14} />
            <span>{badge}</span>
          </div>

          {/* Main Title */}
          <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${headingText} leading-tight`}>
            {title}
          </h1>

          {/* Subtitle */}
          <p className={`mx-auto max-w-2xl text-base sm:text-xl font-medium ${bodyText} leading-relaxed`}>
            {subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={dashHref}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 px-8 py-4 text-base font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:brightness-110 hover:scale-[1.02] transition duration-200"
            >
              <Play size={18} fill="currentColor" />
              <span>Create {title} Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className={`rounded-2xl p-3.5 backdrop-blur-md ${isLight ? "bg-white border border-slate-200/90 shadow-xs" : "border border-white/10 bg-white/5"}`}>
              <span className={`block text-[10px] font-bold ${labelText} uppercase tracking-wider`}>Format</span>
              <span className={`text-sm font-black ${isLight ? "text-slate-900" : "text-white"} flex items-center justify-center gap-1 mt-0.5`}>
                <Film size={14} className="text-blue-500 sm:text-cyan-400" />
                {aspectRatio}
              </span>
            </div>
            <div className={`rounded-2xl p-3.5 backdrop-blur-md ${isLight ? "bg-white border border-slate-200/90 shadow-xs" : "border border-white/10 bg-white/5"}`}>
              <span className={`block text-[10px] font-bold ${labelText} uppercase tracking-wider`}>Render Speed</span>
              <span className="text-sm font-black text-emerald-500 sm:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <Zap size={14} />
                ~25–45s
              </span>
            </div>
            <div className={`rounded-2xl p-3.5 backdrop-blur-md ${isLight ? "bg-white border border-slate-200/90 shadow-xs" : "border border-white/10 bg-white/5"}`}>
              <span className={`block text-[10px] font-bold ${labelText} uppercase tracking-wider`}>Speech Sync</span>
              <span className={`text-sm font-black ${isLight ? "text-slate-900" : "text-white"} flex items-center justify-center gap-1 mt-0.5`}>
                <Cpu size={14} className="text-blue-500 sm:text-cyan-400" />
                Groq Whisper
              </span>
            </div>
            <div className={`rounded-2xl p-3.5 backdrop-blur-md ${isLight ? "bg-white border border-slate-200/90 shadow-xs" : "border border-white/10 bg-white/5"}`}>
              <span className={`block text-[10px] font-bold ${labelText} uppercase tracking-wider`}>Watermark</span>
              <span className="text-sm font-black text-amber-500 sm:text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck size={14} />
                No Watermark
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visual Showcase Section */}
      <section className="relative z-10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <span className={`text-xs font-black uppercase tracking-widest ${brandText}`}>Visual Output Showcase</span>
            <h2 className={`text-2xl sm:text-3xl font-black ${headingText} mt-1`}>
              Sample Rendered Output
            </h2>
          </div>

          <div className={`relative mx-auto max-w-lg overflow-hidden rounded-3xl border ${mainBorder} ${isLight ? "bg-slate-100 shadow-md" : "bg-slate-900 shadow-2xl"} group`}>
            <div className={`relative ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'} w-full overflow-hidden`}>
              <Image
                src={previewImage}
                alt={title}
                fill
                sizes="(min-width: 640px) 500px, 100vw"
                className="object-cover object-center group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              {/* Aspect ratio pill overlay */}
              <div className="absolute top-4 left-4 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-bold text-white flex items-center gap-1.5">
                <Film size={12} className="text-cyan-400" />
                <span>{aspectRatio} Format</span>
              </div>

              {/* Center Play Indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  href={dashHref}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.8)] group-hover:scale-110 transition duration-300"
                >
                  <Play size={26} fill="currentColor" className="ml-1" />
                </Link>
              </div>
            </div>

            <div className={`p-4 ${isLight ? "bg-white border-t border-slate-150" : "bg-slate-900/90 border-t border-white/10"} flex items-center justify-between`}>
              <div>
                <p className={`text-sm font-black ${blockTitleText}`}>{title}</p>
                <p className={`text-xs ${labelText}`}>Rendered in Full HD 1080p</p>
              </div>
              <Link
                href={dashHref}
                className={`rounded-xl ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-white/10 hover:bg-white/20 text-white"} px-4 py-2 text-xs font-bold transition`}
              >
                Use Template
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Videos Showcase for supported templates */}
      {(id === 'auto-caption-generator' || id === 'auto-caption-reel' || id === 'caption-studio') && (
        <section className="relative px-4 py-12 sm:px-6 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-6xl">
            <AutoCaptionDemoSection />
          </div>
        </section>
      )}
      {id === 'compare-explainer' && (
        <section className="relative px-4 py-12 sm:px-6 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-6xl">
            <CompareExplainerDemoSection />
          </div>
        </section>
      )}
      {id === 'typography-video' && (
        <section className="relative px-4 py-12 sm:px-6 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-6xl">
            <TypographyDemoSection />
          </div>
        </section>
      )}

      {/* How It Works (3-Step Timeline) */}
      <section className={`relative z-10 px-4 py-16 sm:px-6 ${altBg} border-y ${mainBorder}`}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className={`text-xs font-black uppercase tracking-widest ${brandText}`}>Step-by-Step Workflow</span>
            <h2 className={`text-2xl sm:text-4xl font-black ${headingText} mt-1`}>
              How {title} Works
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-6 shadow-xs ${stepCardBg}`}
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${isLight ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-cyan-500/10 border border-cyan-400/30 text-cyan-400"} text-xs font-black`}>
                  0{idx + 1}
                </div>
                <h3 className={`text-lg font-black ${subHeadingText} mb-2`}>{item.title}</h3>
                <p className={`text-xs leading-relaxed ${bodyText}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Breakdown Section */}
      <section className="relative z-10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className={`text-xs font-black uppercase tracking-widest ${brandText}`}>Pro Capabilities</span>
            <h2 className={`text-2xl sm:text-4xl font-black ${headingText} mt-1`}>
              What Makes {title} Powerful
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 ${featureCardBg}`}
              >
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${isLight ? "bg-blue-50 text-blue-600" : "bg-blue-500/10 text-cyan-400"}`}>
                  <CheckCircle2 size={18} />
                </div>
                <h4 className={`text-sm font-black ${subHeadingText} mb-1`}>{feat.title}</h4>
                <p className={`text-xs leading-relaxed ${bodyText}`}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience ("Who This Is For") */}
      <section className={`relative z-10 px-4 py-16 sm:px-6 ${altBg} border-t ${mainBorder}`}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className={`text-xs font-black uppercase tracking-widest ${brandText}`}>Designed for Creators &amp; Teams</span>
            <h2 className={`text-2xl sm:text-4xl font-black ${headingText} mt-1`}>
              Who Is {title} For?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {whoIsItFor.map((audience, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 ${audienceCardBg}`}
              >
                <h4 className={`text-base font-black mb-2 ${isLight ? "text-blue-600" : "text-cyan-300"}`}>{audience.role}</h4>
                <p className={`text-xs leading-relaxed ${bodyText}`}>{audience.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Technical Specifications Table */}
      <section className="relative z-10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className={`text-xs font-black uppercase tracking-widest ${brandText}`}>Engine Specifications</span>
            <h2 className={`text-2xl sm:text-3xl font-black ${headingText} mt-1`}>
              Technical Overview
            </h2>
          </div>

          <div className={`overflow-hidden rounded-2xl ${specCardBg}`}>
            <div className={`divide-y ${mainBorder}`}>
              {techSpecs.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 text-xs">
                  <span className={`font-bold ${labelText} uppercase tracking-wider`}>{spec.label}</span>
                  <span className={`font-black ${isLight ? "text-slate-800" : "text-white"} font-mono`}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className={`relative z-10 px-4 py-16 sm:px-6 ${altBg} border-t ${mainBorder}`}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className={`text-xs font-black uppercase tracking-widest ${brandText}`}>Questions Answered</span>
            <h2 className={`text-2xl sm:text-3xl font-black ${headingText} mt-1`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl overflow-hidden transition ${faqCardBg}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`flex items-center justify-between w-full p-4 text-left text-sm font-black ${faqButtonText} transition`}
                    type="button"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className={`px-4 pb-4 text-xs ${bodyText} leading-relaxed border-t ${subtleBorder} pt-3`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Conversion CTA Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${stickyBarBg} p-4 backdrop-blur-xl shadow-lg`}>
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className={`text-sm font-black ${isLight ? "text-slate-900" : "text-white"}`}>{title}</p>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-zinc-400"}`}>Ready in ~25–45 seconds • No watermarks on paid plans</p>
          </div>
          <Link
            href={dashHref}
            className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-xs font-black text-white shadow-md hover:brightness-110 transition"
          >
            Create {title} Now
          </Link>
        </div>
      </div>
    </main>
  );
}
