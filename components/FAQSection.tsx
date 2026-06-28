'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

// Strict typing for FAQs
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Itnavideo?",
    answer: "Itnavideo is an AI reel maker that turns audio, video, images, and voiceovers into short vertical MP4 reels."
  },
  {
    question: "What templates are available?",
    answer: "Itnavideo now focuses on six production templates: Dynamic Creator Reel, Auto Caption Reel, Creator Background Replace, Compare Explainer, Auto Draw Explainer, and Long Video Promo. All six are available on every paid plan."
  },
  {
    question: "Can I test Itnavideo before subscribing?",
    answer: "Yes. The Starter plan at $9/month gives you 25 video credits to explore all templates."
  },
  {
    question: "Do I need editing skills?",
    answer: "No. Choose a template, upload the matching source file, and review the generated reel output."
  },
  {
    question: "What do I need to upload?",
    answer: "Each template clearly shows its required input. Most need a clear video or voiceover; Compare Explainer also needs two images, and Long Video Promo needs a thumbnail."
  },
  {
    question: "Is my data secure?",
    answer: "Your uploaded content is used to create and manage your video render. Uploads are treated as private and temporary, not public gallery content."
  },
  {
    question: "How accurate are the subtitles?",
    answer: "Subtitle quality depends on speech clarity, language, background noise, and pacing. Clear audio or video produces the best results."
  }
];

export default function FAQSection() {
  // TypeScript null or number state
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden px-6 py-28" style={{ background: 'var(--bg-light)' }}>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--color-primary)' }}>FAQ</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black leading-tight tracking-normal md:text-6xl"
            style={{ color: 'var(--text-light-primary)' }}
          >
            Common questions.
          </motion.h2>
          <p className="text-lg max-w-xl mx-auto font-medium" style={{ color: 'var(--text-light-secondary)' }}>
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
                className="group transition-all duration-300"
                style={{
                  borderRadius: 'var(--card-radius)',
                  border: isOpen ? '0.5px solid var(--border-light)' : '0.5px solid var(--border-light)',
                  background: isOpen ? 'var(--color-primary-subtle)' : 'var(--bg-white)',
                  boxShadow: isOpen ? 'none' : 'var(--card-shadow-light)',
                }}
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold transition-colors duration-300" style={{ color: isOpen ? 'var(--text-light-primary)' : 'var(--text-light-secondary)' }}>
                    {faq.question}
                  </span>
                  <div className="p-2 rounded-md transition-all duration-300" style={{ background: isOpen ? 'var(--color-primary-tint)' : 'var(--bg-light)', color: isOpen ? 'var(--color-primary)' : 'var(--text-light-muted)' }}>
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
                      <div className="px-6 pb-6 leading-relaxed text-[15px]" style={{ color: 'var(--text-light-secondary)' }}>
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
          className="text-center mt-12 text-sm"
          style={{ color: 'var(--text-light-muted)' }}
        >
          Still have questions? <Link href="/contact" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Contact our support team</Link>
        </motion.p>
      </div>
    </section>
  );
}
