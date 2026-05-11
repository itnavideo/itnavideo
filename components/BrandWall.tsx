'use client';

import React from 'react';
import { motion } from 'framer-motion';

const brands: string[] = [
  "OpenAI", 
  "Canva", 
  "Stripe", 
  "Firebase", 
  "Cloudinary", 
  "Vercel", 
  "Next.js", 
  "GitHub", 
  "ElevenLabs",
  "Anthropic"
];

export default function BrandWall() {
  return (
    <section className="w-full py-16 bg-black border-y border-white/5 overflow-hidden relative">
      {/* Label */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
          Engineered with World-Class Infrastructure
        </p>
      </div>

      <div className="relative flex items-center">
        {/* Side masking gradients for premium edge fade */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        <motion.div 
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center w-max px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40, // Slower is more professional
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Rendering double brands for seamless loop */}
          {[...brands, ...brands].map((brand, i) => (
            <span 
              key={i} 
              className="text-2xl md:text-5xl font-black text-zinc-800 tracking-tighter uppercase italic transition-all duration-500 hover:text-zinc-500 select-none"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="mt-12 max-w-2xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
    </section>
  );
}