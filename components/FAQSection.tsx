'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
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
    answer: "Every video rendered on Itnavideo is exported in crisp 1080p Full HD at smooth 30 FPS. Vertical 9:16 short-form videos render at 1080×1920 up to 3 minutes, and 16:9 widescreen YouTube videos render at 1920×1080 up to 12 minutes.",
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
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default in M3 style
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 bg-[#050505] border-t border-white/10 text-white">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#FF9100]">
            <Sparkles size={13} className="text-[#FF8F00] animate-pulse" />
            <span>Help &amp; Answers</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white sm:text-5xl font-sans tracking-tight"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>

          <p className="text-xs sm:text-sm max-w-lg mx-auto text-zinc-400 font-normal">
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
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25 font-black scale-[1.02]'
                      : 'border border-white/[0.07] bg-[#0F1117] text-zinc-300 hover:border-[#FF6D00]/40 hover:bg-[#151821] hover:text-white'
                  }`}
                  type="button"
                >
                  <span>{cat.label}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-black/20 text-black font-black' : 'bg-[#151821] text-zinc-400'
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
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`group rounded-[24px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#FF6D00]/60 bg-[#0F1117] shadow-xl shadow-[#FF6D00]/10 ring-1 ring-[#FF6D00]/30'
                    : 'border-white/[0.07] bg-[#0F1117]/80 hover:border-[#FF6D00]/40 hover:bg-[#0F1117]'
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
                        ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black'
                        : 'border border-white/[0.07] bg-[#151821] text-[#FF9100] group-hover:border-[#FF6D00]/50'
                    }`}>
                      {indexNumber}
                    </span>

                    <span className="text-sm sm:text-base font-bold text-white font-sans tracking-tight leading-snug group-hover:text-[#FFA726] transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  {/* Circular Chevron Indicator */}
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'border-[#FF6D00]/50 bg-[#FF6D00]/15 text-[#FFA726] rotate-180'
                      : 'border-white/[0.07] bg-[#151821] text-zinc-400 group-hover:text-white group-hover:border-[#FF6D00]/40'
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
                        <div className="rounded-2xl bg-[#151821]/70 border border-white/[0.07] p-4 sm:p-5 space-y-3">
                          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-normal">
                            {faq.answer}
                          </p>

                          {faq.action && (
                            <div className="pt-2">
                              <Link
                                href={faq.action.href}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFA726] hover:text-[#FF8F00] transition-colors"
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
              </motion.div>
            );
          })}
        </div>

        {/* View All FAQs Link Button */}
        <div className="mt-8 text-center">
          <Link
            href="/video-types#faq"
            className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/40 bg-[#FF6D00]/10 px-6 py-3 text-xs font-black text-[#FFA726] hover:bg-[#FF6D00]/20 hover:border-[#FF6D00]/60 transition-all shadow-md active:scale-95"
          >
            <span>View All FAQs →</span>
          </Link>
        </div>

        {/* Support Card CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-[28px] border border-white/[0.07] bg-[#0F1117] p-6 text-center max-w-xl mx-auto shadow-xl"
        >
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-[#FF6D00]/15 border border-[#FF6D00]/30 text-[#FF9100] mb-2">
            <MessageCircle size={18} />
          </div>
          <h4 className="text-sm font-bold text-white">Have another question?</h4>
          <p className="mt-1 text-xs text-zinc-400">Contact us for product, billing, or workflow questions.</p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#151821] px-5 py-2.5 text-xs font-bold text-white transition hover:border-[#FF6D00]/50 hover:bg-[#1C2840] hover:text-[#FFA726] active:scale-95 shadow-md"
            >
              <span>Contact Support</span>
              <ArrowRight size={13} className="text-[#FF8F00]" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
