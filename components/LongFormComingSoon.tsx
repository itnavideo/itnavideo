'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Youtube, 
  Mic, 
  Video, 
  BookOpen, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const longFormFeatures: Feature[] = [
  { icon: <Youtube size={22} />, title: "YouTube Ready", desc: "5-20 min cinematic 4K renders." },
  { icon: <BookOpen size={22} />, title: "Educational", desc: "Auto-visuals for course creators." },
  { icon: <Briefcase size={22} />, title: "Business Docs", desc: "Professional internal documentaries." },
  { icon: <GraduationCap size={22} />, title: "Masterclass", desc: "Expert-level storytelling flow." }
];

export default function LongFormComingSoon() {
  return (
    <section className="py-32 px-6 relative bg-black overflow-hidden border-t border-white/5">
      {/* Deep Blue Glow for Long-Form distinction */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
            >
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                Waitlist Open • Q3 2026
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tighter text-white"
            >
              Long-Form <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Storytelling.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-12 max-w-xl font-medium"
            >
              Turn 1-hour podcasts or scripts into full-length cinematic documentaries automatically. 
              The engine is evolving—be the first to deploy it.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <a
                href="https://forms.gle/WuqDzdRsuhtnEED4A"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.2)] active:scale-[0.98]"
              >
                Join Long-form Waitlist
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex -space-x-3">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="opacity-80" />
                   </div>
                 ))}
                 <div className="pl-6 flex flex-col">
                    <span className="text-white text-xs font-bold">100+ Creators</span>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">In Queue</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Grid - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {longFormFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 backdrop-blur-xl group hover:border-blue-500/20 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}