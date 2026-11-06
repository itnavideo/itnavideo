'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, Sparkles, Tv, Smartphone, PenTool, ArrowRight } from 'lucide-react';

const DECK_CARDS = [
  {
    id: 'faceless',
    title: '16:9 Faceless Cinema',
    badge: 'YouTube Ready',
    description: 'Cinematic widescreen B-roll with dynamic pacing.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
    icon: Tv,
    color: '#FF5722',
    href: '/dashboard/faceless-video'
  },
  {
    id: 'shorts',
    title: '9:16 Viral Shorts',
    badge: 'TikTok & Reels',
    description: 'Kinetic typography, fast cuts, and instant hooks.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png',
    icon: Smartphone,
    color: '#FFA000',
    href: '/faceless-ai-shorts-generator'
  },
  {
    id: 'whiteboard',
    title: 'Whiteboard Animation',
    badge: 'Educational Explainer',
    description: 'Hand-drawn stickman scenes synced to narration.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892527/whiteboard_video_wamtgr.png',
    icon: PenTool,
    color: '#10B981',
    href: '/dashboard/whiteboard-video'
  }
];

export default function AnimatedFanDeck() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-24 sm:py-32 border-y border-white/10" style={{ backgroundColor: '#070B14' }}>
      {/* Background Ambient Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: "radial-gradient(circle, #FF5722 0%, transparent 60%)", filter: 'blur(80px)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
          >
            A Format for Every <span className="bg-gradient-to-r from-[#FF5722] to-[#FFA000] bg-clip-text text-transparent">Audience</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Hover over our interactive studio deck to see how Itnavideo tailors aspect ratios, visual engines, and typography for different platforms.
          </motion.p>
        </div>

        {/* Fan Deck Container */}
        <div className="relative w-full max-w-4xl h-[400px] sm:h-[500px] flex items-center justify-center perspective-1000 mt-10">
          <AnimatePresence>
            {DECK_CARDS.map((card, index) => {
              const isHovered = hoveredCard === card.id;
              const anyHovered = hoveredCard !== null;
              
              // Base fan out rotation
              const fanRotations = [-15, 0, 15];
              const fanXOffsets = [-120, 0, 120];
              const fanYOffsets = [20, -10, 20];
              
              // When a card is hovered, it comes front and center, others spread further back
              let rotation = fanRotations[index];
              let xOffset = fanXOffsets[index];
              let yOffset = fanYOffsets[index];
              let scale = 1;
              let zIndex = index + 10;
              let opacity = 1;

              if (anyHovered) {
                if (isHovered) {
                  rotation = 0;
                  xOffset = 0;
                  yOffset = -30;
                  scale = 1.1;
                  zIndex = 50;
                  opacity = 1;
                } else {
                  // Push non-hovered cards away based on their position relative to the hovered one
                  const hoverIndex = DECK_CARDS.findIndex(c => c.id === hoveredCard);
                  const diff = index - hoverIndex;
                  rotation = diff * 20;
                  xOffset = diff * 180;
                  yOffset = 40 + Math.abs(diff) * 20;
                  scale = 0.9;
                  zIndex = 10 - Math.abs(diff);
                  opacity = 0.6;
                }
              }

              return (
                <motion.div
                  key={card.id}
                  onHoverStart={() => setHoveredCard(card.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  initial={{ opacity: 0, y: 100, rotate: 0 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 60 }
                  }}
                  animate={{
                    rotate: rotation,
                    x: xOffset,
                    y: yOffset,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="absolute cursor-pointer"
                >
                  <Link href={card.href}>
                    <div 
                      className="group relative w-[280px] sm:w-[320px] aspect-[3/4] rounded-3xl bg-[#121624] border border-white/15 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
                      style={{
                        boxShadow: isHovered ? `0 20px 60px ${card.color}40` : undefined,
                        borderColor: isHovered ? `${card.color}80` : undefined
                      }}
                    >
                      {/* Image Area */}
                      <div className="relative flex-1 overflow-hidden">
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-[#121624]/40 to-transparent" />
                        
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md" style={{ backgroundColor: `${card.color}CC` }}>
                            {card.badge}
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="relative p-6 bg-[#121624] z-10 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: `${card.color}20`, border: `1px solid ${card.color}40` }}>
                            <card.icon size={20} color={card.color} />
                          </div>
                          <h3 className="text-xl font-black text-white">{card.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-4">
                          {card.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: card.color }}>
                          <span>Launch Studio</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}