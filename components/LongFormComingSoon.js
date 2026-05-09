'use client';

import { motion } from 'framer-motion';
import { BookOpen, Briefcase, GraduationCap, Youtube, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LongFormComingSoon() {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-blue-400 text-sm font-medium mb-10 backdrop-blur-md"
        >
          <Youtube size={14} fill="currentColor" />
          <span>Long-Form Videos. Coming Soon.</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-8 leading-[1.1]"
        >
          Turn Your Audio into <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            Full-Length Videos.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Soon, you'll be able to upload your voiceovers and generate complete educational courses,
          in-depth tutorials, informative documentaries, and engaging business content.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 text-zinc-400 text-sm mb-12"
        >
          <span className="flex items-center gap-2"><BookOpen size={16} /> Educational</span>
          <span className="flex items-center gap-2"><GraduationCap size={16} /> Tutorials</span>
          <span className="flex items-center gap-2"><Briefcase size={16} /> Business & More</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <Link href="/waitlist" className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 px-8 py-4 rounded-2xl font-bold text-lg">
            Join Long-Form Waitlist <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}