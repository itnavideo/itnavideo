'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Highlighter,
  Palette,
  Zap,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  FileText,
  Sliders,
  Award,
  ChevronDown,
  BarChart3,
  ShieldCheck,
  Edit3,
  PenTool,
} from 'lucide-react';

export default function WhiteboardVideoDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is an AI Whiteboard Explainer Video?",
      a: "An AI Whiteboard Explainer video transforms spoken dialogue or audio lessons into visually engaging hand-drawn bullet points, diagrams, and key takeaways. As you speak, a realistic drawing hand or stylus draws notes, icons, and underline highlights onto a digital whiteboard in real-time."
    },
    {
      q: "How does Itnavideo extract key bullet points automatically from long audio?",
      a: "Our Gemini-powered AI planner transcribes your speech with word-level precision, analyzes sentence structure to identify core concepts, distills long paragraphs into concise 3 to 5 word summary bullet points, and generates SVG drawing paths synchronized to your voice."
    },
    {
      q: "Do I need drawing skills or complex animation software like VideoScribe or Doodly?",
      a: "No drawing skills or software downloads are needed. Traditional whiteboard tools force you to search for SVG icon libraries, adjust line drawing speeds, and sync audio clips frame-by-frame. Itnavideo handles all drawing animations and layout composition automatically in the cloud."
    },
    {
      q: "What whiteboard styles and marker colors are available?",
      a: "You can choose from multiple board themes: Executive Classic Whiteboard (clean marker), Dark Glass Studio (high-tech neon markers), Blueprint Schematic (architectural grid), and Blackboard Academic. You can also customize marker ink colors and toggle between realistic human hands or modern digital styluses."
    },
    {
      q: "Is Whiteboard Animation suitable for complex technical or educational topics?",
      a: "It is one of the most effective educational formats available. Studies show that watching concepts drawn line-by-line increases learner retention by up to 15% compared to static slides, making it ideal for course instructors, financial advisors, software architects, and medical educators."
    },
    {
      q: "What video resolutions and aspect ratios can I export?",
      a: "Itnavideo exports pristine 1080p Full HD MP4 files optimized for 9:16 vertical reels (Instagram, Shorts, TikTok) and 16:9 widescreen presentations (YouTube, web lectures)."
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo Whiteboard Explainer Studio',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform voiceovers into interactive whiteboard animations with drawing hands, blueprint schematics, and executive marker colors.',
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white font-black shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              IV
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Itnavideo<span className="text-purple-400">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="/video-types" className="hover:text-purple-400 transition">Video Types</Link>
            <Link href="/faceless-video" className="hover:text-purple-400 transition">Faceless Video</Link>
            <Link href="/auto-caption-generator" className="hover:text-purple-400 transition">Auto Captions</Link>
            <Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard?videoType=whiteboard-video"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Whiteboard Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/15 via-purple-600/20 to-pink-500/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-6">
            <PenTool size={14} className="text-emerald-400" />
            <span>AI Whiteboard Explainer Studio • Drawing Hands &amp; Blueprint Schematics</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Turn Any Voiceover Into An{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Interactive Whiteboard Animation
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Stop presenting dry, boring bullet points. AI automatically extracts key concepts from your speech and renders dynamic hand-drawn notes, schematics, and marker highlights in real-time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=whiteboard-video"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Start Whiteboard Generator Free</span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] hover:border-purple-500/30 transition"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-400 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>0% Manual Drawing Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Realistic Hand &amp; Stylus Motion</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Blueprint &amp; Dark Glass Boards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p HD Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHY WHITEBOARD ANIMATIONS WORK */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase text-purple-300">
                <Brain size={14} />
                <span>Cognitive Learning Psychology</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Hand-Drawn Whiteboards Hold Viewer Attention
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Human cognitive processing is naturally drawn to motion and anticipation. When a viewer watches a hand drawing a line, letter, or diagram on a clean canvas, their brain continuously predicts what will be revealed next—a phenomenon known as <strong className="text-white font-semibold">"anticipatory engagement."</strong>
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Educational psychology studies demonstrate that whiteboard animations increase viewer comprehension and information recall by over 15% compared to static PowerPoint slides or traditional talking-head video lectures.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Whether you are explaining financial strategies, technical code architectures, medical research, or business frameworks, an <strong className="text-purple-300 font-semibold">AI Whiteboard Video Generator</strong> converts complex ideas into digestible visual stories.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">15%+ Higher Concept Recall</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Real-time drawing paths keep student and client attention locked to core lesson takeaways.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Highlighter size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Auto Concept Summarization</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AI condenses 20-minute audio recordings into punchy 3-word bullet points drawing on screen.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Cloud Rendering Speed</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Renders complete 1080p whiteboard video files in under 35 seconds without timeline crashes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 BOTTLENECKS SOLVED */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Solved: The 5 Major Whiteboard Bottlenecks
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Legacy whiteboard animation software is clunky and slow. Here is how Itnavideo revolutionizes creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">1. Manual SVG Path Creation</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Searching for vector graphics and manually defining SVG pen stroke paths in legacy desktop software takes 5+ hours per video.
              </p>
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
                <strong className="text-white">Itnavideo Solution:</strong> Speech AI automatically generates stroke paths and text layout.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                <Sliders size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">2. Audio-Visual Timeline Syncing</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Adjusting drawing speeds to match spoken voice timing forces creators into tedious micro-editing on multi-track timelines.
              </p>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-300">
                <strong className="text-white">Itnavideo Solution:</strong> Timestamp-driven drawing speed automatically accelerates to match narration speech.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-6">
                <Palette size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">3. Outdated Clip Art Aesthetics</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Legacy tools rely on cheesy 2010-era cartoon clip art that looks unprofessional for corporate training or agency client deliverables.
              </p>
              <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-xs font-semibold text-pink-300">
                <strong className="text-white">Itnavideo Solution:</strong> Executive marker themes, Dark Glass Studio, and Blueprint schematics.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">4. Distracting Unnatural Hand Assets</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Low-resolution static hand PNGs sliding across screen without natural wrist tilt ruin video immersion.
              </p>
              <div className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 text-xs font-semibold text-fuchsia-300">
                <strong className="text-white">Itnavideo Solution:</strong> High-definition drawing hands and modern digital styluses with fluid motion curves.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">5. Desktop Software Performance Crashes</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Heavy desktop drawing animation software overheats laptops and locks up CPU memory during final 1080p file exports.
              </p>
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs font-semibold text-cyan-300">
                <strong className="text-white">Itnavideo Solution:</strong> 100% cloud rendering on AWS Lambda—zero laptop CPU strain.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STEP BY STEP WORKFLOW */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              How It Works: 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-emerald-400 block mb-4">01</span>
                <h3 className="text-2xl font-extrabold text-white mb-3">Upload Speech Audio</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Drop your recorded voiceover file or paste your lesson script into the whiteboard dashboard.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-300 font-semibold">
                ✓ AI auto summarization
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-purple-400 block mb-4">02</span>
                <h3 className="text-2xl font-extrabold text-white mb-3">Pick Board Style &amp; Marker</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Choose Executive Whiteboard, Dark Glass Studio, or Blueprint schematic with custom drawing hands or stylus.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-purple-300 font-semibold">
                ✓ Customizable ink colors
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-pink-400 block mb-4">03</span>
                <h3 className="text-2xl font-extrabold text-white mb-3">Export 1080p MP4</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Download a crisp, high-definition whiteboard explainer video ready for YouTube, courses, or social media.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-pink-300 font-semibold">
                ✓ Render finished in ~35 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Legacy Doodly / VideoScribe vs. Itnavideo AI Whiteboard Studio
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0E1526] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-6 text-sm font-extrabold uppercase text-slate-400">Feature</th>
                  <th className="p-6 text-sm font-extrabold uppercase text-red-400">Legacy Desktop Software</th>
                  <th className="p-6 text-sm font-extrabold uppercase text-emerald-400 bg-emerald-500/10">Itnavideo AI Whiteboard Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm sm:text-base">
                <tr>
                  <td className="p-6 font-bold text-white">Script Summarization</td>
                  <td className="p-6 text-slate-300">Manual typing line-by-line</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">AI auto distills core bullet takeaways</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Drawing Path Setup</td>
                  <td className="p-6 text-slate-300">Manual SVG vector point tracing (hours)</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">100% Automated drawing path generation</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Modern Board Themes</td>
                  <td className="p-6 text-slate-300">Outdated cartoon whiteboard only</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">Executive Whiteboard, Dark Glass &amp; Blueprint</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#0E1526] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-bold text-white pr-4">{faq.q}</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-purple-400 transition-transform ${isOpen ? 'rotate-180 bg-purple-500/20' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 border-t border-white/10 bg-gradient-to-b from-[#0A0F1D] to-[#070B14] text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Create Your First Whiteboard Video Free</h2>
          <p className="text-slate-300 text-lg mb-8">Transform dry speeches into hand-drawn visual explainer reels in under 35 seconds.</p>
          <Link
            href="/dashboard?videoType=whiteboard-video"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Start Whiteboard Generator Free</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050810] py-12 text-xs text-slate-400 text-center">
        <p>© {new Date().getFullYear()} Itnavideo. All rights reserved.</p>
      </footer>
    </div>
  );
}
