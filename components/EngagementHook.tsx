'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Heart, Smile, Sparkles } from 'lucide-react';

export default function EngagementHook() {
  return (
    <section className="py-24 px-6 bg-black relative">
      {/* Visual background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto border border-white/5 bg-zinc-950/40 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 overflow-hidden relative shadow-2xl">
        
        {/* Subtle top-right accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Retention Optimized</span>
            </motion.div>

            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tightest mb-8 leading-[1.1] text-white"
            >
              Stop the Scroll <br />
              <span className="text-zinc-600 italic">Within</span> <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">3 Seconds.</span>
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg leading-relaxed font-medium max-w-xl mx-auto lg:mx-0"
            >
              Instagram and TikTok aren't for lectures—they're escapes. 
              Our AI ensures your videos aren't just seen, but <span className="text-white italic">felt</span>. 
              We engineer dopamine-friendly hooks that turn casual scrollers into loyal followers.
            </motion.p>
          </div>

          {/* Feature Badge Stack */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4 w-full md:w-80"
          >
            <div className="group flex items-center gap-5 bg-white/5 px-8 py-5 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <div className="p-3 bg-yellow-400/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Zap className="text-yellow-400" size={24} fill="currentColor" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white uppercase">Attention Hooking</span>
            </div>

            <div className="group flex items-center gap-5 bg-white/5 px-8 py-5 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all duration-300">
              <div className="p-3 bg-pink-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Heart className="text-pink-500" size={24} fill="currentColor" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white uppercase">Dopamine Engineered</span>
            </div>

            <div className="group flex items-center gap-5 bg-white/5 px-8 py-5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-300">
              <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Smile className="text-blue-400" size={24} fill="currentColor" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white uppercase">Zero Friction Flow</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
