'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Itnavideo?",
    answer: "Itnavideo is an all-in-one AI video generator and AI video maker that turns your text scripts, talking videos, audio recordings, and images into high-retention vertical reels and widescreen videos — with subtitles, scene layouts, and animations handled by AI."
  },
  {
    question: "Is Itnavideo a free AI video generator?",
    answer: "Yes, you can try Itnavideo for free upon signup to generate video with AI and test the production workflows. Top-up credit packs starting at ₹99 ($2) unlock 1080p Full HD video creation with zero watermarks and faster cloud rendering."
  },
  {
    question: "Can I use Itnavideo as a text to video generator?",
    answer: "Yes! With workflows like AI Video Generator, you can provide a text script, voiceover, or video and our AI automatically designs scenes, syncs kinetic captions, and renders complete videos."
  },
  {
    question: "What video generator types are available?",
    answer: "Specialized AI video creation workflows including Auto Caption Generator, AI Video Generator (16:9), Compare Explainers, Long Video Clips, Whiteboard Explainers, Kinetic Typography, Multi Images Video, Long Video Promos, and AI Audio Cleaner."
  },
  {
    question: "Do I need manual video editing skills?",
    answer: "No. Select your video type, upload your audio, video, or script, and the AI handles transcription, scene pacing, and typography styling. You get a finished MP4 video ready to publish."
  },
  {
    question: "What languages are supported for AI captions?",
    answer: "English and Hinglish (Hindi/English mix in Roman script). Hindi or Hinglish audio produces clean Roman Hinglish captions — no Devanagari. English audio gives English captions."
  },
  {
    question: "How long does AI video generation take?",
    answer: "Most short-form reels render in 20–35 seconds, while long-form 16:9 videos take about 45–60 seconds on our cloud render infrastructure."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 bg-background border-t border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0px,rgba(245,158,11,0.03),transparent_100%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
            <HelpCircle size={12} />
            <span>AI Video Generator FAQ</span>
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl font-sans"
          >
            Frequently Asked <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Questions</span>
          </motion.h2>
          <p className="text-sm max-w-xl mx-auto text-muted-foreground">
            Everything you need to know about our free AI video generator and automated creation platform.
          </p>
        </div>

        <div className="space-y-3.5 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-amber-500/60 bg-amber-50/40 shadow-md ring-1 ring-amber-500/30'
                    : 'border-slate-200/90 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <button
                  className="flex justify-between items-center w-full p-5 sm:p-6 text-left focus:outline-none gap-4"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900 font-sans tracking-tight">
                    {faq.question}
                  </span>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    isOpen
                      ? 'border-amber-300 bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:text-slate-900'
                  }`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm leading-relaxed text-slate-600 font-normal border-t border-amber-100/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Support CTA */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-12 text-xs text-muted-foreground"
        >
          Still have questions?{' '}
          <Link href="/contact" className="hover:underline text-amber-600 dark:text-amber-400 font-bold transition">
            Contact our support team
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
