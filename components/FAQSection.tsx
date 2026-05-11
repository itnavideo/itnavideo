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
    answer: "Itnavideo is an AI-powered SaaS platform that transforms your voiceovers into professional, cinematic short-form videos automatically. Just upload your audio, and our AI handles captions, B-roll, transitions, and more."
  },
  {
    question: "How does Itnavideo save me time?",
    answer: "Traditional video editing can take hours. Itnavideo's AI automates the entire process, from script generation to visual synchronization and rendering, reducing creation time to minutes instead of hours."
  },
  {
    question: "Do I need any editing skills?",
    answer: "No! Itnavideo is designed for creators of all skill levels. Our intuitive platform and powerful AI mean you don't need any prior video editing experience to create stunning videos."
  },
  {
    question: "What kind of videos can I create?",
    answer: "Currently, Itnavideo specializes in short-form videos (9:16) optimized for Instagram Reels, TikTok, and YouTube Shorts. We are actively developing support for long-form educational and business content."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we prioritize security. All media and data are stored using industry-standard encryption via Firebase. We use secure authentication protocols to ensure your content remains yours."
  },
  {
    question: "How accurate are the AI captions?",
    answer: "We leverage state-of-the-art models like OpenAI's Whisper for transcription, achieving up to 99% accuracy with millisecond-level synchronization."
  }
];

export default function FAQSection() {
  // TypeScript null or number state
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6"
          >
            Got <span className="text-purple-500">Questions?</span> <br />
            We’ve Got Answers.
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
            Everything you need to know about scaling your content with Itnavideo.
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
                className={`group border rounded-3xl transition-all duration-300 ${
                  isOpen 
                  ? 'bg-white/[0.03] border-purple-500/30' 
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
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    isOpen ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-zinc-500'
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
          Still have questions? <a href="/contact" className="text-purple-400 hover:underline">Contact our support team</a>
        </motion.p>
      </div>
    </section>
  );
}