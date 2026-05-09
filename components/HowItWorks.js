'use client';

import { motion } from 'framer-motion';
import { Mic, Cpu, Film, CheckCircle2, Music2, Sparkles } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Input Voice",
    desc: "Upload your raw voiceover or audio clips.",
    icon: <Mic size={32} />,
    color: "bg-blue-500",
    shadow: "shadow-blue-500/20",
    animation: (
      <div className="flex items-center gap-1 h-12">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [10, 40, 10] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            className="w-1.5 bg-blue-400 rounded-full"
          />
        ))}
      </div>
    )
  },
  {
    id: 2,
    title: "AI Synthesis",
    desc: "Our neural engine syncs visuals, captions, and B-roll.",
    icon: <Cpu size={32} />,
    color: "bg-purple-500",
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
    desc: "Download your platform-ready 4K video.",
    icon: <Film size={32} />,
    color: "bg-orange-500",
    shadow: "shadow-orange-500/20",
    animation: (
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="relative bg-zinc-800 w-32 h-20 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl"
      >
        <div className="absolute top-2 left-2 bg-green-500 w-2 h-2 rounded-full animate-pulse" />
        <Film className="text-zinc-500 opacity-50" size={40} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <CheckCircle2 className="absolute bottom-2 right-2 text-green-400" size={16} />
      </motion.div>
    )
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            From <span className="text-zinc-500">Audio</span> to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Cinema</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium uppercase tracking-[0.2em]">
            Three Steps to Perfection
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12 md:gap-8 items-start">
          
          {/* Animated Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-[25%] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-0">
             <motion.div 
               animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute top-[-2px] w-20 h-[4px] bg-purple-500 blur-sm rounded-full"
             />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center group"
            >
              {/* Top Visual Animation */}
              <div className="h-40 flex items-center justify-center mb-8 w-full">
                {step.animation}
              </div>

              {/* Step Icon & Card */}
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] w-full text-center group-hover:border-white/10 transition-all backdrop-blur-xl relative overflow-hidden">
                
                {/* Glowing corner effect */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 ${step.color} opacity-[0.03] blur-[40px] rounded-full`} />

                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white ${step.shadow} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  {step.icon}
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-[10px] font-bold bg-zinc-900 text-zinc-500 px-2 py-1 rounded-md">
                    STEP 0{step.id}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3 tracking-tight">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>

              {/* Mobile Connector */}
              {index < steps.length - 1 && (
                <div className="md:hidden h-12 w-[1px] bg-gradient-to-b from-purple-500 to-transparent my-4" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
           <p className="text-zinc-600 text-sm font-medium">Automated pipeline powered by OpenAI & Canva Enterprise</p>
        </motion.div>
      </div>
    </section>
  );
}