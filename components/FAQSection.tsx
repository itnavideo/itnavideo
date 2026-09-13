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
    question: "What is Itnavideo?",
    answer: "Itnavideo is an all-in-one AI video generator that turns your text scripts, talking videos, audio recordings, and images into high-retention vertical reels and widescreen videos — with subtitles, scene layouts, and animations handled automatically by AI.",
    category: 'product',
    categoryLabel: 'Product & AI',
    action: {
      label: 'Explore Features',
      href: '/features',
    },
  },
  {
    question: "Is Itnavideo a free AI video generator?",
    answer: "Yes, you can try Itnavideo for free upon signup to generate video with AI and test the production workflows. Monthly packs and plans starting at $29 unlock 1080p Full HD video creation with zero watermarks and faster cloud rendering.",
    category: 'pricing',
    categoryLabel: 'Credits & Pricing',
    action: {
      label: 'View Pricing & Packs',
      href: '/pricing',
    },
  },
  {
    question: "Can I use Itnavideo as a text to video generator?",
    answer: "Yes! With workflows like AI Video Generator and Faceless Video, you can provide a text script, topic, or voiceover and our AI automatically designs scenes, syncs kinetic captions, and renders complete videos.",
    category: 'workflows',
    categoryLabel: 'Video Workflows',
    action: {
      label: 'Try Faceless Video',
      href: '/dashboard?videoType=faceless-video',
    },
  },
  {
    question: "What video generator types are available?",
    answer: "We support specialized AI video creation workflows including Auto Caption Generator, Faceless Video (16:9 up to 20 min), Compare Explainers, Long Video Clips, Whiteboard Explainers, Kinetic Typography, Long Video Promos, and AI Audio Cleaner.",
    category: 'workflows',
    categoryLabel: 'Video Workflows',
    action: {
      label: 'Browse All Workflows',
      href: '/video-types',
    },
  },
  {
    question: "Do I need manual video editing skills?",
    answer: "No. Select your video type, upload your audio, video, or script, and the AI handles transcription, scene pacing, and typography styling. You get a finished MP4 video ready to publish.",
    category: 'product',
    categoryLabel: 'Product & AI',
  },
  {
    question: "What languages are supported for AI captions?",
    answer: "English and Hinglish (Hindi/English mix in Roman script) via high-speed Groq Whisper. Hindi or Hinglish audio produces clean Roman Hinglish captions — no Devanagari. English audio gives English captions.",
    category: 'product',
    categoryLabel: 'Product & AI',
  },
  {
    question: "How long does AI video generation take?",
    answer: "Most short-form reels render in 20–35 seconds, while long-form 16:9 videos take about 45–60 seconds on our cloud render infrastructure.",
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
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 bg-[#0B0F19] border-t border-white/10 text-white">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0px,rgba(249,115,22,0.05),transparent_100%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header — Material Design 3 Typography & Badge */}
        <div className="text-center mb-10 sm:mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-400 backdrop-blur-md">
            <Sparkles size={13} className="text-orange-400 animate-pulse" />
            <span>Help &amp; Answers</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white sm:text-5xl font-sans tracking-tight"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>

          <p className="text-xs sm:text-sm max-w-lg mx-auto text-zinc-400 font-normal">
            Everything you need to know about our AI video workflows, cloud rendering, and plans.
          </p>

          {/* M3 Segmented Category Filter Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 pt-2">
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
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 font-extrabold scale-[1.02]'
                      : 'border border-white/10 bg-[#111827] text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
                  type="button"
                >
                  <span>{cat.label}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white font-bold' : 'bg-white/10 text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* M3 Expansion Panels */}
        <div className="space-y-3.5 max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const indexNumber = String(index + 1).padStart(2, '0');

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-orange-500/40 bg-[#111827] shadow-xl ring-1 ring-orange-500/20'
                    : 'border-white/10 bg-[#111827]/80 hover:border-orange-500/30 hover:bg-[#111827]'
                }`}
              >
                <button
                  className="flex items-center justify-between w-full p-4 sm:p-5 text-left focus:outline-none gap-3.5 cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  type="button"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* M3 Tonal Index Badge */}
                    <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl text-xs font-mono font-bold transition-colors ${
                      isOpen
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                        : 'bg-white/5 text-zinc-400 group-hover:bg-orange-500/10 group-hover:text-orange-400'
                    }`}>
                      {indexNumber}
                    </span>

                    <span className="text-sm sm:text-base font-bold text-white font-sans tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  {/* Expressive Circular Chevron Indicator */}
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'border-orange-500/40 bg-orange-500/15 text-orange-400 rotate-180'
                      : 'border-white/10 bg-white/5 text-zinc-400 group-hover:text-white group-hover:border-orange-500/30'
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
                        <div className="rounded-2xl bg-[#070A11] border border-white/10 p-4 sm:p-5 space-y-3">
                          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-normal">
                            {faq.answer}
                          </p>

                          {faq.action && (
                            <div className="pt-2">
                              <Link
                                href={faq.action.href}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
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

        {/* M3 Support Card CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl border border-white/10 bg-[#111827] p-6 text-center max-w-xl mx-auto backdrop-blur-md shadow-xl"
        >
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-orange-500/10 text-orange-400 mb-2">
            <MessageCircle size={18} />
          </div>
          <h4 className="text-sm font-bold text-white">Have another question?</h4>
          <p className="mt-1 text-xs text-zinc-400">Our production engineering team is ready to help you 24/7.</p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-6 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-orange-500/20"
            >
              <span>Contact Support</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
