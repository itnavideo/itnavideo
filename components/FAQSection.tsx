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
    answer: "Itnavideo is an AI video tool that turns your talking videos, audio, and images into short vertical reels — with captions, layouts, and styling handled by AI."
  },
  {
    question: "What video types are available?",
    answer: "Multiple focused video types: Auto Caption Video (word-level captions), Compare Explainer Video (left vs right with sticker presenter), and Long Video Promo (short teaser for long-form content). More types are added regularly."
  },
  {
    question: "How much does it cost?",
    answer: "New users get 1 free AI video with a watermark. After that, Pro and Business plans unlock more monthly videos with no watermark, priority rendering, and more templates."
  },
  {
    question: "Do I need editing skills?",
    answer: "No. Pick a video type, upload your file, and the AI handles layout, timing, and captions. You get a finished MP4 ready to post."
  },
  {
    question: "What do I need to upload?",
    answer: "Each video type shows exactly what it needs. Auto Caption needs a video with speech. Compare Explainer needs audio + 2 images. Long Video Promo needs a short clip + thumbnail."
  },
  {
    question: "What languages are supported for captions?",
    answer: "English and Hinglish (Hindi/English mix in Roman script). Hindi or Hinglish audio produces clean Roman Hinglish captions — no Devanagari. English audio gives English captions."
  },
  {
    question: "Is my data secure?",
    answer: "Your uploads are private and temporary. Files are only used to create your video. Final MP4 download links expire after about 48 hours."
  },
  {
    question: "How long does rendering take?",
    answer: "Usually 2-5 minutes depending on video length and current server load. You can wait on the page or come back later — your video will be ready."
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
