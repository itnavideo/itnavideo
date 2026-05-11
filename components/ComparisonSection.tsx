'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Clock, Coins, Brain, Zap, Sparkles } from 'lucide-react';

interface ComparisonItem {
  feature: string;
  manual: string;
  ai: string;
  manualIcon: React.ReactNode;
  aiIcon: React.ReactNode;
}

const comparisons: ComparisonItem[] = [
  {
    feature: "Time Investment",
    manual: "4–6 Hours per video",
    ai: "~2 Minutes total",
    manualIcon: <Clock size={18} className="text-red-500" />,
    aiIcon: <Zap size={18} className="text-green-400" />,
  },
  {
    feature: "Technical Skills",
    manual: "Requires Pro Software",
    ai: "Zero editing skills needed",
    manualIcon: <Brain size={18} className="text-red-500" />,
    aiIcon: <Sparkles size={18} className="text-green-400" />,
  },
  {
    feature: "Captioning & Sync",
    manual: "Manual keyframing",
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

const aiIconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.2, rotate: 12, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

const manualIconVariants = {
  initial: { scale: 1, x: 0 },
  hover: { x: [0, -2, 2, -2, 2, 0], transition: { duration: 0.4 } }
};

export default function ComparisonSection() {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white"
          >
            Stop <span className="text-zinc-700 italic">Editing</span>. <br className="md:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Start Creating.
            </span>
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
            Traditional editing is a bottleneck. Itnavideo removes the technical barriers between your voice and a viral video.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional Way - Dull & Frustrating */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover="hover"
            className="bg-zinc-950/50 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm relative opacity-80 group hover:opacity-100 transition-opacity"
          >
            <div className="mb-10">
              <h3 className="text-xl font-bold text-zinc-500 mb-2 uppercase tracking-widest">Manual Workflow</h3>
              <p className="text-zinc-600 text-sm font-medium italic">The slow, expensive, and painful way</p>
            </div>

            <div className="space-y-8">
              {comparisons.map((item, idx) => (
                <div key={idx} className="flex items-start gap-5">
                  <motion.div 
                    variants={manualIconVariants}
                    className="mt-1 bg-red-500/5 p-2.5 rounded-xl border border-red-500/10"
                  >
                    {item.manualIcon}
                  </motion.div>
                  <div>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-wider mb-1">{item.feature}</p>
                    <p className="text-zinc-400 font-semibold">{item.manual}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
               <p className="text-zinc-700 font-bold uppercase tracking-[0.2em] text-[10px]">Net Loss: 100+ Hours/Mo</p>
            </div>
          </motion.div>

          {/* Itnavideo Way - Professional & Fast */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover="hover"
            className="relative rounded-[3rem] p-[1.5px] bg-gradient-to-br from-purple-500/40 via-transparent to-pink-500/40 group overflow-hidden"
          >
            <div className="bg-zinc-950 rounded-[2.9rem] p-8 md:p-12 h-full flex flex-col relative z-10 backdrop-blur-3xl">
              
              <div className="mb-10">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Itnavideo AI</h3>
                  <span className="bg-purple-600/20 text-purple-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">
                    Proprietary Engine
                  </span>
                </div>
                <p className="text-purple-400/80 text-sm font-bold tracking-tight">The content operating system for the AI age</p>
              </div>

              <div className="space-y-8 flex-1">
                {comparisons.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-5">
                    <motion.div 
                      variants={aiIconVariants}
                      className="mt-1 bg-green-400/10 p-2.5 rounded-xl border border-green-500/10 shadow-[0_0_20px_rgba(74,222,128,0.05)]"
                    >
                      {item.aiIcon}
                    </motion.div>
                    <div>
                      <p className="text-purple-500/50 text-[10px] font-black uppercase tracking-wider mb-1">{item.feature}</p>
                      <p className="text-white font-bold">{item.ai}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                 <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-2xl shadow-white/5">
                    Deploy AI Pipeline
                 </button>
                 <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Efficiency Gain: 3,000%</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}