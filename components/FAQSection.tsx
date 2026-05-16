'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

// Strict typing for FAQs
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Itnavideo?",
    answer: "Itnavideo is an AI Shorts platform for creators. The current MVP creates typography-first videos from one voiceover audio file."
  },
  {
    question: "How does Itnavideo save me time?",
    answer: "It handles the repetitive setup behind short-form videos, so you can focus on recording clear ideas and publishing more consistently."
  },
  {
    question: "Do I need any editing skills?",
    answer: "No! Itnavideo is designed for creators of all skill levels. Our intuitive platform and powerful AI mean you don't need any prior video editing experience to create stunning videos."
  },
  {
    question: "What kind of videos can I create?",
    answer: "Currently, Itnavideo specializes in 9:16 short-form videos optimized for Instagram Reels, TikTok, and YouTube Shorts. The active MVP path is voiceover audio to typography video."
  },
  {
    question: "What do I need to upload?",
    answer: "Upload one clear MP3, WAV, or M4A voiceover. Images, screenshots, clips, and face-camera videos are temporarily paused."
  },
  {
    question: "Is my data secure?",
    answer: "Your account, project status, uploads, and final MP4 files are handled through secure managed systems. Your uploaded content is used only to create and manage your videos."
  },
  {
    question: "How accurate are the AI captions?",
    answer: "Caption quality depends on audio clarity, language, background noise, and pacing. Clear voiceovers produce the best results."
  }
];

export default function FAQSection() {
  // TypeScript null or number state
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-[#070707] px-6 py-28">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">FAQ</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
          >
            Common questions.
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
            Everything you need to know before creating your first Itnavideo short.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-lg border transition-all duration-300 ${
                  isOpen 
                  ? 'bg-brand-mint/10 border-brand-mint/30' 
                  : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                }`}
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className={`text-lg font-semibold transition-colors duration-300 ${
                    isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-md transition-all duration-300 ${
                    isOpen ? 'bg-brand-mint/20 text-brand-mint' : 'bg-white/5 text-zinc-500'
                  }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="px-6 pb-6 text-zinc-400 leading-relaxed text-[15px]">
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
          className="text-center mt-12 text-zinc-500 text-sm"
        >
          Still have questions? <a href="/contact" className="text-brand-mint hover:underline">Contact our support team</a>
        </motion.p>
      </div>
    </section>
  );
}
