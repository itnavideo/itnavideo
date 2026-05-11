'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Cpu, Film, CheckCircle2, Sparkles } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  shadow: string;
  animation: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Input Voice",
    desc: "Upload your raw voiceover or audio clips to our secure portal.",
    icon: <Mic size={32} />,
    color: "bg-blue-600",
    shadow: "shadow-blue-500/20",
    animation: (
      <div className="flex items-center gap-1.5 h-12">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [12, 40, 12] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            className="w-2 bg-blue-400 rounded-full"
          />
        ))}
      </div>
    )
  },
  {
    id: 2,
    title: "AI Synthesis",
    desc: "Our neural engine syncs visuals, captions, and B-roll in real-time.",
    icon: <Cpu size={32} />,
    color: "bg-purple-600",
    shadow: "shadow-purple-500/20",
    animation: (
      <div className="relative w-20 h-20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-purple-500/20 p-4 rounded-2xl"
        >
          <Sparkles className="text-purple-400" />
        </motion.div>
      </div>
    )
  },
  {
    id: 3,
    title: "Cinematic Export",
    desc: "Receive a platform-ready 4K video optimized for engagement.",
    icon: <Film size={32} />,
    color: "bg-orange-600",
    shadow: "shadow-orange-500/20",
    animation: (
      <motion.div 
        initial={{ y: 10 }}
        animate={{ y: -10 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        className="relative bg-zinc-900 w-32 h-20 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl"
      >
        <div className="absolute top-2 left-2 bg-green-500 w-1.5 h-1.5 rounded-full animate-pulse" />
        <Film className="text-zinc-700" size={32} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <CheckCircle2 className="absolute bottom-2 right-2 text-green-400" size={16} />
      </motion.div>
    )
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.05)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-6 text-white"
          >
            From <span className="text-zinc-600 italic font-medium">Audio</span> to <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
              Visual Excellence
            </span>
          </motion.h2>
          <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto font-bold uppercase tracking-[0.3em]">
            The Three-Stage Pipeline
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-16 md:gap-8 items-start">
          {/* Desktop Progress Line */}
          <div className="hidden md:block absolute top-[22%] left-[10%] right-[10%] h-[1px] bg-zinc-900 z-0">
            <motion.div 
              animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-1px] w-32 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[2px]"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center group"
            >
              {/* Animation Stage */}
              <div className="h-48 flex items-center justify-center mb-4 w-full">
                {step.animation}
              </div>

              {/* Card Structure */}
              <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-[3rem] w-full text-center group-hover:border-purple-500/20 transition-all duration-500 backdrop-blur-3xl relative">
                
                {/* Icon Circle */}
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-8 text-white ${step.shadow} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  {React.cloneElement(step.icon as React.ReactElement, { size: 28 })}
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-black bg-white/5 text-zinc-400 px-3 py-1.5 rounded-full tracking-[0.1em]">
                    PHASE 0{step.id}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              {/* Connector for Mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden h-16 w-[1px] bg-gradient-to-b from-purple-500/50 to-transparent my-4" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center border-t border-white/5 pt-12"
        >
          <p className="text-zinc-700 text-xs font-bold uppercase tracking-widest">
            Enterprise Grade Pipeline • 99.9% Uptime • Powered by Neural Sync
          </p>
        </motion.div>
      </div>
    </section>
  );
}