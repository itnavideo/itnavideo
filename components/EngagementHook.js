'use client';

import { motion } from 'framer-motion';
import { Zap, Heart, Smile } from 'lucide-react';

export default function EngagementHook() {
  return (
    <section className="py-20 px-6 bg-black relative">
      <div className="max-w-4xl mx-auto border border-white/5 bg-zinc-950/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
        
        {/* Subtle background animation */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black tracking-tightest mb-6 leading-tight"
            >
              They don't scroll <br />
              <span className="text-zinc-500">to learn.</span> <br />
              They scroll <span className="text-purple-400">to feel.</span>
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg leading-relaxed font-medium tracking-tight"
            >
              Instagram and TikTok are escapes—places to de-stress and stay connected. 
              Your audience isn't looking for a lecture; they're looking for a hook. 
              <span className="text-white"> Itnavideo makes your content the reason they stop scrolling.</span>
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-4 w-full md:w-auto"
          >
            <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
              <Zap className="text-yellow-400" size={24} fill="currentColor" />
              <span className="font-bold text-sm tracking-tight">Engaging, Not Boring</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
              <Heart className="text-pink-500" size={24} fill="currentColor" />
              <span className="font-bold text-sm tracking-tight">Built for Dopamine</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
              <Smile className="text-blue-400" size={24} fill="currentColor" />
              <span className="font-bold text-sm tracking-tight">Remove the Stress</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}