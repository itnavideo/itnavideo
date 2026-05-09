'use client';

import { motion } from 'framer-motion';

const brands = [
  "OpenAI", "Canva", "Stripe", "Firebase", "Cloudinary", "Vercel", "Next.js", "GitHub", "Stripe", "OpenAI"
];

export default function BrandWall() {
  return (
    <div className="w-full py-10 bg-black border-y border-white/5 overflow-hidden relative">
      {/* Side masking gradients for that premium fade effect */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <motion.div 
        className="flex whitespace-nowrap gap-16 md:gap-24 items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Rendering brands twice to ensure a seamless infinite loop */}
        {[...brands, ...brands].map((brand, i) => (
          <span 
            key={i} 
            className="text-2xl md:text-4xl font-bold text-zinc-800 tracking-tighter uppercase italic hover:text-zinc-600 transition-colors cursor-default select-none"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
}