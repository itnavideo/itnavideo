'use client';

import { motion } from 'framer-motion';
import { X, Check, Clock, Coins, Wand2, Coffee, Zap, Brain } from 'lucide-react';

const comparisons = [
  {
    feature: "Time Investment",
    manual: "4–6 Hours per video",
    ai: "~2 Minutes total",
    manualIcon: <Clock size={18} className="text-red-500" />,
    aiIcon: <Zap size={18} className="text-green-400" />,
  },
  {
    feature: "Technical Skills",
    manual: "Requires Pro Software knowledge",
    ai: "Zero editing skills needed",
    manualIcon: <Coffee size={18} className="text-red-500" />,
    aiIcon: <Brain size={18} className="text-green-400" />,
  },
  {
    feature: "Captioning & Sync",
    manual: "Manual keyframing & timing",
    ai: "Frame-accurate AI sync",
    manualIcon: <X size={18} className="text-red-500" />,
    aiIcon: <Check size={18} className="text-green-400" />,
  },
  {
    feature: "Cost Efficiency",
    manual: "$50–$200 per video",
    ai: "Less than $1 per video",
    manualIcon: <Coins size={18} className="text-red-500" />,
    aiIcon: <Check size={18} className="text-green-400" />,
  },
];

// AI icons ke liye smooth spring animation
const aiIconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.2, rotate: 12, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

// Traditional icons ke liye frustrated "shake" animation
const manualIconVariants = {
  initial: { scale: 1, x: 0 },
  hover: { x: [0, -2, 2, -2, 2, 0], transition: { duration: 0.4 } }
};

export default function ComparisonSection() {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
          >
            Stop Editing. <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Start Creating.</span>
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Traditional editing is a bottleneck. Itnavideo removes the technical barriers between your voice and a viral video.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional Editing Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover="hover"
            className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm relative group"
          >
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-zinc-400 mb-2">Traditional Method</h3>
              <p className="text-zinc-600 text-sm italic">"The slow, expensive, and painful way"</p>
            </div>

            <div className="space-y-8">
              {comparisons.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <motion.div 
                    variants={manualIconVariants}
                    className="mt-1 bg-red-500/10 p-2 rounded-lg"
                  >
                    {item.manualIcon}
                  </motion.div>
                  <div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{item.feature}</p>
                    <p className="text-zinc-400 font-medium">{item.manual}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5">
               <p className="text-red-500/60 font-bold text-center uppercase tracking-widest text-sm">Frustrating & Slow</p>
            </div>
          </motion.div>

          {/* Itnavideo AI Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover="hover"
            className="relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-purple-500/40 via-transparent to-pink-500/40 shadow-2xl shadow-purple-500/10 group overflow-hidden"
          >
            <div className="bg-zinc-950 rounded-[2.4rem] p-8 md:p-12 h-full flex flex-col relative z-10">
              
              {/* Subtle Internal Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white">Itnavideo AI</h3>
                  <span className="bg-purple-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Powered by GPT-4o</span>
                </div>
                <p className="text-purple-400/80 text-sm font-medium">"The future of content operation systems"</p>
              </div>

              <div className="space-y-8 flex-1">
                {comparisons.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <motion.div 
                      variants={aiIconVariants}
                      className="mt-1 bg-green-400/10 p-2 rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                    >
                      {item.aiIcon}
                    </motion.div>
                    <div>
                      <p className="text-purple-400/50 text-xs font-bold uppercase tracking-wider mb-1">{item.feature}</p>
                      <p className="text-white font-bold">{item.ai}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                 <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/5">
                   Try It For Free
                 </button>
              </div>
            </div>
          </motion.div>

        </div>

        <div className="mt-20 text-center">
           <p className="text-zinc-600 text-sm">Save over 100+ hours of manual labor per month.</p>
        </div>
      </div>
    </section>
  );
}