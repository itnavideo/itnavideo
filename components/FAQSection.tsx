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
    answer: "Itnavideo is an all-in-one AI video generator with 10+ specialized video studios and 1 audio utility. Each studio has its own dedicated pipeline, controls, and 1080p Full HD output format instead of forcing every project through a complicated timeline editor.",
    category: 'product',
    categoryLabel: 'Product & AI',
    action: { label: 'Explore All Studios', href: '#video-types' },
  },
  {
    question: "How do credit plans work?",
    answer: "Plans start at just $19.99/mo (or get 2 months free with annual billing). Starter includes 100 credits/mo, Growth includes 250 credits/mo, and Pro includes 600 credits/mo. Credits are instantly added to your studio balance with no watermarks.",
    category: 'pricing',
    categoryLabel: 'Credits & Pricing',
    action: { label: 'View Pricing & Credit Plans', href: '/pricing' },
  },
  {
    question: "Which AI video types are available?",
    answer: "Our 10+ video studios include Faceless Video, Book Summary Video, Image to Video AI, YouTube Subtitles (16:9 Widescreen), Auto Caption Generator, Kinetic Typography, Whiteboard Animation, Compare Explainer, Long Video to Clips, and Long Video Promo (9:16 Shorts), plus our AI Audio Cleaner utility.",
    category: 'workflows',
    categoryLabel: 'Video Workflows',
    action: { label: 'Explore All Dedicated Studio Pages & Specs', href: '/video-types' },
  },
  {
    question: "Can I use bilingual audio, different accents, or regional speech?",
    answer: "Yes! You can upload voiceovers in English, bilingual speech, or regional accents. Itnavideo transcribes spoken audio with dialect awareness, pairing visual concepts with relevant HD stock B-roll and visuals, while rendering clean, phonetic word-synced subtitles.",
    category: 'product',
    categoryLabel: 'Product & AI',
  },
  {
    question: "What video resolutions, quality, and durations are supported?",
    answer: "Every video rendered on Itnavideo is exported in crisp 1080p Full HD at smooth 30 FPS. All 9:16 vertical short-form videos (Reels, Shorts, TikTok) render at 1080×1920 up to 90 seconds (90s). All 16:9 widescreen YouTube videos render at 1920×1080 up to 5 minutes (300s). Long Video to Viral Clips accepts long-form source videos up to 2 hours and exports 30s–60s 1080p shorts at 1 credit per clip.",
    category: 'workflows',
    categoryLabel: 'Video Workflows',
  },
  {
    question: "How does credit pricing work?",
    answer: "Credit pricing is simple and transparent: all 9:16 vertical videos (up to 90s) cost 1 credit. 16:9 widescreen videos cost 1 credit per minute (up to 5 minutes = 5 credits max). For Viral Clips, each generated short costs 1 credit (e.g. 5 clips = 5 credits). AI Audio Cleaner costs 1 credit.",
    category: 'pricing',
    categoryLabel: 'Credits & Pricing',
    action: { label: 'View Credit Plans', href: '/pricing' },
  },
  {
    question: "Do I need manual video editing skills?",
    answer: "No timeline editing is required. Upload your media or script, configure the studio options, and let AI generate a polished 1080p Full HD video.",
    category: 'product',
    categoryLabel: 'Product & AI',
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
    <section id="faq" className="relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 bg-white border-t border-stone-200/80 text-slate-900">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <HelpCircle size={14} className="text-[#FF5722]" />
            <span>Help &amp; Answers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-sans tracking-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-xs sm:text-sm max-w-lg mx-auto text-slate-600 font-normal">
            Everything you need to know about our AI video workflows, cloud rendering, and plans.
          </p>

          {/* Segmented Category Filter Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-1 pt-2">
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
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white border-transparent shadow-xs font-bold'
                      : 'border-stone-200/80 bg-white text-slate-700 hover:border-orange-500/30 hover:bg-orange-50/20 shadow-xs'
                  }`}
                  type="button"
                >
                  <span>{cat.label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                    isActive ? 'bg-black/20 text-white font-bold' : 'bg-stone-100 text-slate-600'
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
                className={`group rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-orange-500/40 bg-white shadow-xs ring-1 ring-orange-500/20'
                    : 'border-stone-200/80 bg-white shadow-xs hover:border-orange-500/30'
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
                        ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white font-bold'
                        : 'border border-stone-200/80 bg-stone-50 text-slate-600 group-hover:border-orange-500/30 group-hover:text-orange-600'
                    }`}>
                      {indexNumber}
                    </span>

                    <span className="text-sm sm:text-base font-bold text-slate-900 font-sans tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  {/* Circular Chevron Indicator */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                    isOpen
                      ? 'border-orange-500/40 bg-orange-500/10 text-orange-600 rotate-180'
                      : 'border-stone-200/80 bg-stone-50 text-slate-400 group-hover:border-orange-500/30 group-hover:text-slate-700'
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
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6">
                        <div className="rounded-2xl bg-stone-50/80 border border-stone-200/80 p-5 sm:p-6 space-y-3.5 shadow-xs">
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
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
        <div className="mt-10 rounded-2xl border border-stone-200/80 bg-white p-6 text-center max-w-xl mx-auto shadow-xs">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 mb-2">
            <MessageCircle size={18} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Have another question?</h4>
          <p className="mt-1 text-xs text-slate-600">Contact us for product, billing, or workflow questions.</p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-stone-50 active:scale-95 shadow-xs"
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
