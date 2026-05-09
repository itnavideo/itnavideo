'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
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
    answer: "Currently, Itnavideo specializes in short-form videos optimized for platforms like Instagram Reels, TikTok, and YouTube Shorts. We are actively developing support for long-form educational, tutorial, and business videos."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we prioritize your data security. All uploaded media and generated content are stored securely using industry-standard encryption and access controls. We use Firebase for secure authentication and Firestore for data management."
  },
  {
    question: "How accurate are the AI captions?",
    answer: "We use advanced AI models like OpenAI's Whisper API for speech-to-text, ensuring up to 99% accuracy in caption generation and millisecond-level synchronization with your audio."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6"
          >
            Frequently Asked <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Questions
            </span>
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about Itnavideo and how it can transform your content creation.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                {openIndex === index ? (
                  <Minus size={20} className="text-purple-400" />
                ) : (
                  <Plus size={20} className="text-zinc-400" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-6 pb-6 text-zinc-400 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}