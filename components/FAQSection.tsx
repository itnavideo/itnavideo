'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: 'product' | 'pricing' | 'workflows';
  categoryLabel: string;
  action?: {
    label: string;
    href: string;
  };
}

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'product', label: 'Product & AI' },
  { id: 'workflows', label: 'Video Workflows' },
  { id: 'pricing', label: 'Credits & Pricing' },
] as const;

const faqs: FAQItem[] = [
  {
    question: "What is Itnavideo AI Video Generator?",
    answer: "Itnavideo is an AI video generator with 11 specialized video studios. Each studio has its own optimized pipeline, controls, and 1080p Full HD output format instead of forcing every project through a complicated timeline editor.",
    category: 'product',
    categoryLabel: 'Product & AI',
    action: { label: 'Explore All 11 Video Studios', href: '/video-types' },
  },
  {
    question: "Can I try Itnavideo for free?",
    answer: "Yes. New creators can start with free video renders without entering a credit card. You get instant access to auto captions, explainers, typography, and clip tools.",
    category: 'pricing',
    categoryLabel: 'Credits & Pricing',
    action: { label: 'View Pricing & Credit Plans', href: '/pricing' },
  },
  {
    question: "Which AI video types are available?",
    answer: "The 11 specialized studios are Auto Caption Generator, YouTube Subtitles, Image to Video AI, Compare Explainer, Whiteboard Explainer, Kinetic Typography, Faceless Video, Long Video Promo, Long Video to Viral Clips, AI Audio Cleaner, and Book Summary Video.",
    category: 'workflows',
    categoryLabel: 'Video Workflows',
    action: { label: 'Compare All 11 Video Styles', href: '/video-types' },
  },
  {
    question: "Do I need manual video editing skills?",
    answer: "No timeline editing is required. Upload your media or script, configure the studio options, and let AI generate a polished 1080p Full HD video.",
    category: 'product',
    categoryLabel: 'Product & AI',
  },
  {
    question: "What video resolutions, quality, and durations are supported?",
    answer: "Every video rendered on Itnavideo is exported in crisp 1080p Full HD at smooth 30 FPS. All 9:16 vertical short-form videos (Reels, Shorts, TikTok) render at 1080×1920 up to 90 seconds (90s). All 16:9 widescreen YouTube videos render at 1920×1080 up to 5 minutes (300s). Long Video to Viral Clips accepts long-form source videos up to 2 hours and exports 30s–60s 1080p shorts.",
    category: 'workflows',
    categoryLabel: 'Video Workflows',
  },
  {
    question: "How long does video generation take?",
    answer: "Most short videos and auto-captions render in under 60 seconds on our cloud rendering engine. Your dashboard displays live progress stages in real time.",
    category: 'pricing',
    categoryLabel: 'Credits & Pricing',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 bg-white border-t border-slate-200/80 text-slate-900">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3.5">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <HelpCircle size={14} className="text-[#FF5722]" />
            <span>Help &amp; Answers</span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 sm:text-5xl font-sans tracking-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-xs sm:text-sm max-w-lg mx-auto text-slate-600 font-normal">
            Everything you need to know about our AI video workflows, cloud rendering, and plans.
          </p>

          {/* Segmented Category Filter Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-2">
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' ? faqs.length : faqs.filter(f => f.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/25 font-black scale-[1.02]'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-500/40 hover:bg-orange-50/40 hover:text-orange-950'
                  }`}
                  type="button"
                >
                  <span>{cat.label}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-black/20 text-white font-black' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expansion Panels */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const indexNumber = String(index + 1).padStart(2, '0');

            return (
              <div
                key={faq.question}
                className={`group rounded-[24px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-orange-500/60 bg-white shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/30'
                    : 'border-slate-200 bg-white hover:border-orange-500/40'
                }`}
              >
                <button
                  className="flex items-center justify-between w-full p-4 sm:p-5 text-left focus:outline-none gap-3.5 cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  type="button"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Index Badge */}
                    <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl text-xs font-mono font-bold transition-colors ${
                      isOpen
                        ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white font-black'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 group-hover:border-orange-500/50 group-hover:text-orange-600'
                    }`}>
                      {indexNumber}
                    </span>

                    <span className="text-sm sm:text-base font-bold text-slate-900 font-sans tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  {/* Circular Chevron Indicator */}
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'border-orange-500/50 bg-orange-500/15 text-orange-600 rotate-180'
                      : 'border-slate-200 bg-slate-50 text-slate-400 group-hover:text-slate-800 group-hover:border-orange-500/40'
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6">
                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-3">
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                            {faq.answer}
                          </p>

                          {faq.action && (
                            <div className="pt-2">
                              <Link
                                href={faq.action.href}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                              >
                                <span>{faq.action.label}</span>
                                <ArrowRight size={13} />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Card CTA */}
        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 text-center max-w-xl mx-auto shadow-md">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 mb-2">
            <MessageCircle size={18} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Have another question?</h4>
          <p className="mt-1 text-xs text-slate-600">Contact us for product, billing, or workflow questions.</p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-orange-500/50 hover:bg-orange-50/50 hover:text-orange-950 active:scale-95 shadow-2xs"
            >
              <span>Contact Support</span>
              <ArrowRight size={13} className="text-[#FF5722]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
