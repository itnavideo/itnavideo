'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-20 bg-black">
      
      {/* Dynamic AI-Themed Background */}
      <div className="absolute inset-0 z-0">
        {/* Glowing Aura 1 - Top Left */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full"
        />

        {/* Glowing Aura 2 - Bottom Right */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full"
        />

        {/* Futuristic Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px' 
          }} 
        />

        {/* Animated Vertical Beams */}
        <div className="absolute inset-0 z-0 opacity-30">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ top: "-10%", left: `${20 + i * 30}%`, opacity: 0 }}
              animate={{ top: "110%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
              className="absolute w-[1px] h-32 bg-gradient-to-b from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-purple-400 text-sm font-medium mb-10 backdrop-blur-md"
        >
          <Sparkles size={14} fill="currentColor" />
          <span>Next-Gen AI Video Operating System</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-8 leading-[1.1]"
        >
          Your Voice, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white/50">
            Cinematic Vision.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          Upload your voiceover and watch our neural engine generate scripts, 
          sync b-roll, and craft transitions in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link href="/signup" className="group w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
            Start Creating Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg text-white border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm">
            Explore Features
          </Link>
        </motion.div>
      </div>
    </section>
  );
}