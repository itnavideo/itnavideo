'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Twitter } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  social: string;
  avatar: string;
  category: "Engagement" | "ROI" | "Speed";
}

const testimonials: Testimonial[] = [
  {
    quote: "Itnavideo transformed my content workflow. What used to take hours now takes minutes. Engagement is up 300%.",
    author: "Alex V.",
    title: "Shorts Creator",
    social: "@AlexCreatesAI",
    avatar: "https://i.pravatar.cc/150?u=alex",
    category: "Speed"
  },
  {
    quote: "AI captions are spot-on, and auto B-roll selection is pure magic. A game-changer for digital educators.",
    author: "Dr. Maya S.",
    title: "EdTech Influencer",
    social: "@EduTech_Maya",
    avatar: "https://i.pravatar.cc/150?u=maya",
    category: "Engagement"
  },
  {
    quote: "I've cut video production costs by 80%. Quality is consistently professional. Highly recommend for agencies.",
    author: "Ben K.",
    title: "Agency Owner",
    social: "@BenKMarketing",
    avatar: "https://i.pravatar.cc/150?u=ben",
    category: "ROI"
  },
  {
    quote: "Mood detection is incredible! My videos now perfectly match the tone of my voiceovers automatically.",
    author: "Chloe L.",
    title: "Lifestyle Vlogger",
    social: "@ChloeLifeStyle",
    avatar: "https://i.pravatar.cc/150?u=chloe",
    category: "Engagement"
  },
  {
    quote: "From idea to publish in 5 minutes. Unlocked a new level of productivity for my agency clients.",
    author: "David R.",
    title: "Growth Lead",
    social: "@DigitalGrowth",
    avatar: "https://i.pravatar.cc/150?u=david",
    category: "Speed"
  },
  {
    quote: "Finally, an AI tool that understands storytelling. My tutorials are more engaging than ever.",
    author: "Sarah P.",
    title: "Tech Reviewer",
    social: "@GadgetGuru",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    category: "Engagement"
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-900 border border-white/5 mb-6"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-orange-400 text-orange-400" />)}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">4.9/5 by 200+ Creators</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6"
          >
            Loved by the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
              Next Generation.
            </span>
          </motion.h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/20 transition-all group relative overflow-hidden"
            >
              <Quote className="absolute -top-4 -right-4 size-24 text-white/[0.02] group-hover:text-purple-500/[0.05] transition-colors" />
              
              <div className="flex items-center gap-2 mb-6">
                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                   t.category === 'ROI' ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                   t.category === 'Speed' ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' :
                   'bg-purple-500/5 border-purple-500/20 text-purple-400'
                 }`}>
                   {t.category}
                 </span>
              </div>

              <p className="text-zinc-300 text-lg leading-relaxed mb-8 font-medium italic">
                "{t.quote}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10" />
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-black">
                      <Twitter size={8} className="text-white fill-current" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{t.author}</h4>
                    <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider">{t.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}